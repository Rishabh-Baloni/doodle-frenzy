const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 20 },
  isHost: { type: Boolean, default: false },
  score: { type: Number, default: 0, min: 0 },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }, // Fixed reference
  socketId: { type: String },
  lastActive: { type: Date, default: Date.now, index: true },
  isDrawing: { type: Boolean, default: false },
  hasGuessedWord: { type: Boolean, default: false },
  streak: { type: Number, default: 0 }
}, { timestamps: true });

// Capitalized model name
module.exports = mongoose.model('Player', playerSchema); 