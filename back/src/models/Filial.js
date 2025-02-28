const mongoose = require('mongoose');

const FilialSchema = new mongoose.Schema({
  nombre_filial: { type: String, required: true },
  slug_filial: { type: String, unique: true, required: true },
  imagen_filial: String,
  cotizaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion' }]
}, { timestamps: true });

module.exports = mongoose.model('Filial', FilialSchema);
