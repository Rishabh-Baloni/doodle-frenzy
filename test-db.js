require('./backend/node_modules/dotenv').config()
const mongoose = require('./backend/node_modules/mongoose')

async function test() {
  try {
    console.log('Connecting to MongoDB...')
    const uri = process.env.MONGODB_URI
    console.log('URI:', uri.substring(0, 50) + '...')
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    })
    
    console.log('✅ Connected!')
    console.log('Connection state:', mongoose.connection.readyState)
    console.log('Database name:', mongoose.connection.db.databaseName)
    
    // Wait a bit more
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('\nLoading models...')
    const Game = require('./backend/models/game')
    console.log('✅ Game model loaded')
    
    console.log('\nAttempting to create a game...')
    const game = new Game({
      partyCode: 'TEST' + Date.now(),
      settings: {
        rounds: 3,
        drawingTime: 60,
        maxPlayers: 8
      }
    })
    
    console.log('Saving game...')
    await game.save()
    console.log('✅ Game saved successfully!')
    console.log('Game ID:', game._id)
    
    await mongoose.disconnect()
    console.log('\n🎉 All tests passed!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    console.error(err)
    process.exit(1)
  }
}

test()
