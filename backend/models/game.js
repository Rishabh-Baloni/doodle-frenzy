const mongoose = require('mongoose');
const { getRandomWord } = require('../utils/words');

const gameSchema = new mongoose.Schema({
  partyCode: { 
    type: String, 
    required: true, 
    unique: true,       // ← This already creates an index
    uppercase: true,
    trim: true
    // REMOVED: index: true if it was here
  },
  players: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player'
  }],
  status: { 
    type: String, 
    default: 'lobby',
    enum: ['lobby', 'playing', 'finished']
  },
  settings: {
    rounds: { type: Number, default: 3, min: 1, max: 10 },
    customWords: { 
      type: [String], 
      default: ['apple', 'banana', 'mountain'],
      validate: [
        val => val.every(word => word.length <= 20),
        'Words must be ≤20 chars'
      ]
    },
    drawingTime: { type: Number, default: 60, min: 30, max: 180 },
    maxPlayers: { type: Number, default: 8, min: 2, max: 12 }
  },
  currentRound: { type: Number, default: 0, min: 0 },
  currentWord: { type: String, default: '', trim: true },
  usedWords: [{ type: String }],
  currentDrawer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  turnOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  guessedPlayers: [{ type: mongoose.Schema.Types.Mixed }],
  messages: [{
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  canvasState: { 
    type: mongoose.Schema.Types.Mixed,
    default: null 
  },
  timeLeft: { type: Number, default: 0, min: 0 },
  phase: { type: String, default: 'choosing', enum: ['choosing', 'drawing'] },
  wordChoices: { type: [String], default: [] }
}, { timestamps: true });

// KEEP THIS (status index is still needed)
gameSchema.index({ status: 1, createdAt: -1 }); 

gameSchema.methods.startGame = function() {
  this.status = 'playing';
  this.currentRound = 1;
  this.turnOrder = [...this.players];
  this.currentDrawer = this.turnOrder[0];
  this.guessedPlayers = [];
  this.phase = 'choosing';
  this.wordChoices = this.getWordChoices();
  this.currentWord = '';
  this.timeLeft = 0;
  return this.save();
};

gameSchema.methods.getNewWord = function() {
  let word;
  do {
    word = getRandomWord();
  } while (this.usedWords.includes(word));
  
  this.usedWords.push(word);
  return word;
};

gameSchema.methods.getWordChoices = function() {
  const choices = new Set();
  while (choices.size < 3) {
    choices.add(this.getNewWord());
  }
  return Array.from(choices);
};

gameSchema.methods.nextTurn = function() {
  const order = Array.isArray(this.turnOrder) ? this.turnOrder : [];
  if (order.length === 0) return this.save();

  const currentDrawerId = this.currentDrawer && this.currentDrawer._id
    ? this.currentDrawer._id.toString()
    : String(this.currentDrawer);

  const orderIds = order.map(p => (p && p._id ? p._id.toString() : String(p)));
  const currentDrawerIndex = orderIds.findIndex(id => id === currentDrawerId);
  const safeIndex = currentDrawerIndex >= 0 ? currentDrawerIndex : -1;
  const nextDrawerIndex = ((safeIndex + 1) % order.length + order.length) % order.length;

  if (nextDrawerIndex === 0) {
    this.currentRound++;
    if (this.currentRound > this.settings.rounds) {
      this.status = 'finished';
      return this.save();
    }
  }

  this.currentDrawer = order[nextDrawerIndex];
  this.guessedPlayers = [];
  this.phase = 'choosing';
  this.wordChoices = this.getWordChoices();
  this.currentWord = '';
  this.timeLeft = 0;
  return this.save();
};

module.exports = mongoose.model('Game', gameSchema);