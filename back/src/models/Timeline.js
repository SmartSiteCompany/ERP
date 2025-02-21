//moodels/Timneline
const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  event: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Timeline', timelineSchema);
