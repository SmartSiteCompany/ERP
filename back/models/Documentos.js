const mongoose = require('mongoose');

const documentoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['contrato', 'factura', 'propuesta', 'otro'], required: true },
  fecha_subida: { type: Date, default: Date.now },
  archivo: { type: String, required: true }, // URL o referencia al archivo
});

module.exports = mongoose.model('Documento', documentoSchema);