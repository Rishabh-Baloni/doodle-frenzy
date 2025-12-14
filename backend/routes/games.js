// doodle-backend/routes/games.js
const express = require('express');
const router = express.Router();

// NOTE: Models will be loaded when this module is called, not at require time
// This prevents models from being created before database connection

// NOTE: Socket.io "connection" handlers are in index.js

module.exports = (io) => {
  // Load models here, after DB connection is established
  const Game = require('../models/game');
  const Player = require('../models/player');
  
  const timers = new Map();

  const startRoundTimer = async (partyCode, initial) => {
    clearRoundTimer(partyCode);
    let timeLeft = typeof initial === 'number' ? initial : 60;
    timers.set(partyCode, setInterval(async () => {
      try {
        timeLeft = Math.max(0, timeLeft - 1);
        await Game.findOneAndUpdate(
          { partyCode },
          { $set: { timeLeft, updatedAt: new Date() } },
          { runValidators: false }
        );
        io.to(partyCode).emit('time-update', timeLeft);
        if (timeLeft <= 0) {
          clearRoundTimer(partyCode);
          const g = await Game.findOne({ partyCode }).populate('players currentDrawer');
          if (g) {
            await g.nextTurn();
            await g.populate('players currentDrawer');
            // Reset and restart timer for next turn
            const restart = g.settings?.drawingTime || 60;
            await Game.findOneAndUpdate(
              { partyCode },
              { $set: { timeLeft: restart, updatedAt: new Date() } },
              { runValidators: false }
            );
            io.to(partyCode).emit('game:update', g);
            startRoundTimer(partyCode, restart);
          }
        }
      } catch (err) {
        // noop
      }
    }, 1000));
  };

  const clearRoundTimer = (partyCode) => {
    const t = timers.get(partyCode);
    if (t) {
      clearInterval(t);
      timers.delete(partyCode);
    }
  };
  // Join existing game
  router.post('/:partyCode/join', async (req, res) => {
    try {
      const { partyCode } = req.params;
      const { player } = req.body;

      const game = await Game.findOne({ partyCode }).populate('players');
      if (!game) return res.status(404).json({ error: 'Game not found' });
      if (game.status !== 'lobby') return res.status(400).json({ error: 'Game already in progress. Joining is disabled.' });

      const existingPlayer = game.players.find(p => p.name === player.name);
      if (existingPlayer) {
        return res.status(400).json({ error: 'Player already exists in game' });
      }

      const newPlayer = await Player.create({
        name: player.name,
        game: game._id,
        socketId: req.query.socketId
      });

      game.players.push(newPlayer._id);
      await game.save();

      const updatedGame = await Game.findById(game._id).populate('players currentDrawer');
      io.to(partyCode).emit('game:update', updatedGame);
      io.to(partyCode).emit('players-updated', updatedGame.players);

      res.json({ success: true, player: newPlayer, game: updatedGame });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Start game
  router.patch('/:partyCode/start', async (req, res) => {
    try {
      const { partyCode } = req.params;
      const game = await Game.findOne({ partyCode }).populate('players');
      if (!game) return res.status(404).json({ error: 'Game not found' });
      if (!game.players.length) return res.status(400).json({ error: 'No players in game' });

      await game.startGame();
      await game.populate('players currentDrawer');

      io.to(partyCode).emit('game:update', game);
      // Timer starts after drawer chooses a word
      res.json({ success: true, game });
    } catch (err) {
      console.error('Start game error:', err);
      res.status(500).json({ error: 'Failed to start game' });
    }
  });

  // Next turn
  router.patch('/:partyCode/next-turn', async (req, res) => {
    try {
      const { partyCode } = req.params;
      const game = await Game.findOne({ partyCode }).populate('players');
      if (!game) return res.status(404).json({ error: 'Game not found' });

      await game.nextTurn();
      await game.populate('players currentDrawer');

      io.to(partyCode).emit('game:update', game);
      // Next turn now enters choosing phase; timer will start on word selection
      res.json({ success: true, game });
    } catch (err) {
      console.error('Next-turn error:', err);
      res.status(500).json({ error: 'Failed to advance turn' });
    }
  });

  // Update game settings
  router.patch('/:partyCode', async (req, res) => {
    try {
      const { partyCode } = req.params;
      const updates = req.body;
      
      const game = await Game.findOne({ partyCode }).populate('players currentDrawer');
      if (!game) return res.status(404).json({ error: 'Game not found' });
      
      // Only allow updates to settings when game is in lobby
      if (game.status !== 'lobby') {
        return res.status(400).json({ error: 'Cannot update settings while game is in progress' });
      }
      
      // Update the game with provided data
      Object.assign(game, updates);
      await game.save();
      
      // Emit update to all players in the room
      io.to(partyCode).emit('game:update', game);
      
      res.json({ success: true, game });
    } catch (err) {
      console.error('Update game error:', err);
      res.status(500).json({ error: 'Failed to update game' });
    }
  });

  // Get game
  router.get('/:partyCode', async (req, res) => {
    try {
      const { partyCode } = req.params;
      const game = await Game.findOne({ partyCode }).populate('players currentDrawer');
      if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
      res.json({ success: true, game });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to get game state' });
    }
  });

  // Cleanup
  router.get('/cleanup', async (_req, res) => {
    try {
      const emptyGames = await Game.find({
        $or: [
          { players: { $size: 0 } },
          { updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        ]
      });
      await Player.deleteMany({ game: { $in: emptyGames.map(g => g._id) } });
      await Game.deleteMany({ _id: { $in: emptyGames.map(g => g._id) } });
      res.json({ success: true, deleted: emptyGames.length });
    } catch {
      res.status(500).json({ success: false, error: 'Cleanup failed' });
    }
  });

  // Rejoin
  router.post('/:partyCode/rejoin', async (req, res) => {
    const { partyCode } = req.params;
    const { player } = req.body;
    try {
      const game = await Game.findOne({ partyCode }).populate('players');
      if (!game) return res.status(404).json({ error: 'Game not found' });

      const foundPlayer = game.players.find(
        p => p._id.toString() === player._id?.toString()
      );
      if (!foundPlayer) return res.status(404).json({ error: 'Player not found in game' });
      if (req.query.socketId) {
        await Player.findByIdAndUpdate(foundPlayer._id, { socketId: req.query.socketId, lastActive: new Date() });
      }
      const refreshed = await Game.findOne({ partyCode }).populate('players currentDrawer');
      res.json({ game: refreshed, player: { ...foundPlayer.toObject(), socketId: req.query.socketId || foundPlayer.socketId } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create new game
  router.post('/', async (req, res) => {
    const { player } = req.body;
    try {
      const partyCode = generatePartyCode();

      const newGame = await Game.create({
        partyCode,
        players: [],
        status: 'lobby',
        settings: { rounds: 3, customWords: ['apple', 'banana', 'mountain'], drawingTime: 60, maxPlayers: 8 },
        currentRound: 0,
        currentWord: '',
        messages: [],
        canvasState: null,
        turnOrder: [],
        guessedPlayers: [],
        phase: 'choosing',
        wordChoices: []
      });

      const newPlayer = await Player.create({
        name: player.name,
        isHost: true,
        game: newGame._id,
        socketId: req.query.socketId
      });

      newGame.players.push(newPlayer._id);
      newGame.currentDrawer = newPlayer._id;
      await newGame.save();

      const populatedGame = await Game.findById(newGame._id).populate('players currentDrawer');
      res.status(201).json({ success: true, game: populatedGame, player: newPlayer });
    } catch (err) {
      console.error('Create game error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};

function generatePartyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
