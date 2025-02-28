// src/models/EstadoCuenta.js
const mongoose = require('mongoose');

const EstadoCuentaSchema = new mongoose.Schema({
  id_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  total_estado_cuenta: Number,
  anticipo_estado_cuenta: Number,
  restante: Number,
  cantidad_semanas: Number,
  dia_pago: String,
  metodo_pago: String,
  recargo_impuntualidad: Number
}, { timestamps: true });

module.exports = mongoose.model('EstadoCuenta', EstadoCuentaSchema);
