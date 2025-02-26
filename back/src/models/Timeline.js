const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  event: { type: String, required: true },
  description: { type: String }, // Nuevo campo opcional
  timestamp: { type: Date, default: Date.now, index: true }, // Índice para búsquedas más rápidas
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Timeline', timelineSchema);

