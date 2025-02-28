const mongoose = require('mongoose');

const DetalleCotizacionSchema = new mongoose.Schema({
  codigo_detalle_cotizacion: { type: String, required: true },
  descripcion_detalle_cotizacion: String,
  precio_unitario_detalle_cotizacion: Number,
  unidades_detalle_cotizacion: Number,
  precio_total_detalle_cotizacion: Number,
  costo_smart_detalle_cotizacion: Number
}, { timestamps: true });

module.exports = mongoose.model('DetalleCotizacion', DetalleCotizacionSchema);
