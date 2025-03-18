const mongoose = require('mongoose');

const servicioFinanciadoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  descripcion: { type: String, required: true },
  monto_servicio: { type: Number, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_termino: { type: Date },
  pago_semanal: { type: Number, required: true },
  saldo_restante: { type: Number, required: true },
});

module.exports = mongoose.model('ServicioFinanciado', servicioFinanciadoSchema);