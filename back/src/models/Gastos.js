const mongoose = require('mongoose');

const GastoSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Gasto', GastoSchema);
