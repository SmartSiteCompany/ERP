const mongoose = require('mongoose');

const estadoCuentaSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  servicio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServicioFinanciado', required: true },
  fecha_estado: { type: Date, default: Date.now },
  saldo_inicial: { type: Number, required: true },
  pago_total: { type: Number, required: true },
  saldo_actual: { type: Number, required: true },
  pago_semanal: { type: Number, required: true },
  total_a_pagar: { type: Number, required: true },
});

module.exports = mongoose.model('EstadoCuenta', estadoCuentaSchema);