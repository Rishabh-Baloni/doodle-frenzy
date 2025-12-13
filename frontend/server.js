require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')
const next = require('next')
const gamesRouter = require('../backend/routes/games')
const Game = require('../backend/models/game')
const Player = require('../backend/models/player')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  }
})

if (mongoose.connection.models['game']) delete mongoose.connection.models['game']
if (mongoose.connection.models['player']) delete mongoose.connection.models['player']

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL
  if (!uri) {
    throw new Error('Missing MONGODB_URI or MONGODB_URL environment variable')
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    maxPoolSize: 20,
    retryWrites: true,
    w: 'majority'
  })
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const activeSockets = new Map()
const timers = new Map()

async function startRoundTimer(partyCode) {
  const existing = timers.get(partyCode)
  if (existing) clearInterval(existing)
  let g = await Game.findOne({ partyCode }).populate('players currentDrawer')
  if (!g) return
  let timeLeft = g.settings?.drawingTime || 60
  await Game.findOneAndUpdate(
    { partyCode },
    { $set: { timeLeft, updatedAt: new Date() } },
    { runValidators: false }
  )
  io.to(partyCode).emit('time-update', timeLeft)
  const interval = setInterval(async () => {
    try {
      timeLeft = Math.max(0, timeLeft - 1)
      await Game.findOneAndUpdate(
        { partyCode },
        { $set: { timeLeft, updatedAt: new Date() } },
        { runValidators: false }
      )
      io.to(partyCode).emit('time-update', timeLeft)
      if (timeLeft <= 0) {
        clearInterval(interval)
        timers.delete(partyCode)
        g = await Game.findOne({ partyCode }).populate('players currentDrawer')
        if (g) {
          const entries = Array.isArray(g.guessedPlayers) ? g.guessedPlayers : []
          const maxPoints = entries.reduce((m, e) => Math.max(m, e?.points || 0), 0)
          if (maxPoints > 0 && g.currentDrawer) {
            await Player.findByIdAndUpdate(g.currentDrawer._id || g.currentDrawer, { $inc: { score: Math.floor(maxPoints / 2) } })
          }
          await g.nextTurn()
          await g.populate('players currentDrawer')
          io.to(partyCode).emit('game:update', g)
        }
      }
    } catch {}
  }, 1000)
  timers.set(partyCode, interval)
}

io.on('connection', async (socket) => {
  const { partyCode, playerId } = socket.handshake.query
  if (!partyCode) return

  try {
    socket.join(partyCode)
    activeSockets.set(socket.id, { partyCode, playerId })

    if (playerId) {
      try { await Player.findByIdAndUpdate(playerId, { socketId: socket.id, lastActive: new Date() }) } catch {}
    }

    const game = await Game.findOne({ partyCode }).populate('players currentDrawer')
    if (!game) {
      socket.emit('error', { message: 'Game not found' })
      return
    }
    socket.emit('game:update', game)
    if (typeof game.timeLeft === 'number' && game.status === 'playing') {
      socket.emit('time-update', game.timeLeft)
    }

    socket.on('disconnect', () => {
      activeSockets.delete(socket.id)
      io.to(partyCode).emit('player-left', playerId)
    })

    socket.on('update-drawing', async ({ partyCode: pc, canvasData }) => {
      try {
        await Game.findOneAndUpdate(
          { partyCode: pc },
          { $set: { canvasState: canvasData, updatedAt: new Date() } },
          { runValidators: false }
        ).exec()
      } catch {}
      socket.to(pc).emit('drawing-update', canvasData)
    })

    socket.on('send-message', async ({ partyCode: pc, message }) => {
      try {
        const g = await Game.findOne({ partyCode: pc }).populate('players')
        if (!g) return

        const drawerId = g.currentDrawer?._id || g.currentDrawer
        const isDrawerSender = String(message.senderId) === String(drawerId)

        const normalized = String(message.text || '').trim().toLowerCase()
        const target = String(g.currentWord || '').trim().toLowerCase()

        const socketsInRoom = []
        for (const [sid, meta] of activeSockets.entries()) {
          if (meta.partyCode === pc) socketsInRoom.push({ sid, playerId: meta.playerId })
        }

        const senderSocket = socketsInRoom.find(s => String(s.playerId) === String(message.senderId))
        const drawerSocket = socketsInRoom.find(s => String(s.playerId) === String(drawerId))

        if (normalized && target && normalized === target && !isDrawerSender) {
          if (drawerSocket) io.to(drawerSocket.sid).emit('chat-message', message)
          if (senderSocket) io.to(senderSocket.sid).emit('chat-message', message)
        } else {
          io.to(pc).emit('chat-message', message)
        }
        if (String(message.senderId) === String(drawerId)) return

        if (normalized && target && normalized === target) {
          const guessedPlayers = Array.isArray(g.guessedPlayers) ? g.guessedPlayers : []
          const already = guessedPlayers.some(e => String(e?.playerId || e) === String(message.senderId))
          if (already) return

          const bucketMs = 2000
          const now = Date.now()
          const bucket = Math.floor(now / bucketMs)
          const distinctBuckets = new Set(guessedPlayers.map(e => e.bucket).filter(b => typeof b === 'number'))
          const bucketIndex = distinctBuckets.has(bucket) ? distinctBuckets.size - 1 : distinctBuckets.size
          const points = Math.max(100 - bucketIndex * 10, 10)

          const pDoc = await Player.findByIdAndUpdate(
            message.senderId,
            { $inc: { score: points } },
            { new: true }
          )

          await Game.findOneAndUpdate(
            { partyCode: pc },
            { $push: { guessedPlayers: { playerId: message.senderId, points, timestamp: new Date(now), bucket } }, $set: { updatedAt: new Date() } }
          )

          io.to(pc).emit('correct-guess', {
            playerId: message.senderId,
            playerName: pDoc?.name || 'Player',
            points
          })

          const updatedGame = await Game.findOne({ partyCode: pc }).populate('players currentDrawer')
          io.to(pc).emit('game:update', updatedGame)
        }
      } catch {}
    })

    socket.on('choose-word', async ({ partyCode: pc, word }) => {
      try {
        const g = await Game.findOne({ partyCode: pc }).populate('players currentDrawer')
        if (!g) return
        const drawerId = g.currentDrawer?._id || g.currentDrawer
        if (String(playerId) !== String(drawerId)) return
        if (!Array.isArray(g.wordChoices) || !g.wordChoices.includes(word)) return

        g.currentWord = word
        g.wordChoices = []
        g.phase = 'drawing'
        g.timeLeft = g.settings?.drawingTime || 60
        g.guessedPlayers = []
        await g.save()
        await g.populate('players currentDrawer')
        io.to(pc).emit('game:update', g)
        startRoundTimer(pc)
      } catch {}
    })

    socket.on('join-game', async () => {
      const updatedGame = await Game.findOne({ partyCode }).populate('players currentDrawer')
      io.to(partyCode).emit('game:update', updatedGame)
    })

    socket.on('request-time-update', async (code) => {
      const g = await Game.findOne({ partyCode: code })
      if (g) io.to(code).emit('time-update', g.timeLeft)
    })

    socket.on('round-ended', async (code) => {
      const g = await Game.findOne({ partyCode: code })
      if (g && typeof g.nextRound === 'function') {
        await g.nextRound()
        io.to(code).emit('game:update', g)
      }
    })
  } catch {}

  socket.on('error', () => {})
})

app.use('/api/games', gamesRouter(io))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', dbState: mongoose.connection.readyState, activeSockets: activeSockets.size, environment: process.env.NODE_ENV || 'development' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

async function start() {
  const dev = false
  const nextApp = next({ dev, dir: __dirname })
  const handle = nextApp.getRequestHandler()
  await nextApp.prepare()
  app.all('*', (req, res) => handle(req, res))
  const PORT = Number(process.env.PORT) || 4000
  server.listen(PORT, () => {})
  connectToDatabase().catch(err => {
    console.error('DB connect failed:', err?.message || err)
  })
}

start()