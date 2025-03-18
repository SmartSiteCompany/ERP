const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  servicio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServicioFinanciado', required: true },
  fecha_pago: { type: Date, default: Date.now },
  monto_pago: { type: Number, required: true },
  saldo_pendiente: { type: Number, required: true },
  nuevo_pago_semanal: { type: Number }, // Ajuste del pago semanal si hay servicios adicionales
});

module.exports = mongoose.model('Pago', pagoSchema);