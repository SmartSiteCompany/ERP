const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({
  fecha_cotizacion: { type: Date, required: true },
  validez_cotizacion: { type: Date, required: true },
  subtotal_cotizacion: Number,
  costo_smart_cotizacion: Number,
  utilidad_cotizacion: Number,
  descuento_cotizacion: Number,
  total_sin_financiamiento_cotizacion: Number,
  total_con_financiamiento_cotizacion: Number,
  anticipo_cotizacion: Number,
  financiamiento_cotizacion: Number,
  cantidad_plazos_cotizacion: Number,
  cantidad_a_pagar_plazos_cotizacion: Number,
  id_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cotizacion', CotizacionSchema);

