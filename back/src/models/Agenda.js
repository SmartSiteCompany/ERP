const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true, index: true }, // Agregado índice para búsquedas rápidas
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Asegurar que cada agenda tenga un creador
}, { timestamps: true });

module.exports = mongoose.model('Agenda', agendaSchema);
