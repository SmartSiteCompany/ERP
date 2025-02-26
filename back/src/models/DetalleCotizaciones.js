// Detalle Cotizaciones
const DetalleCotizacionSchema = new mongoose.Schema({
    id_detalle_cotizacion: { type: Number, required: true, unique: true },
    codigo_detalle_cotizacion: String,
    descripcion_detalle_cotizacion: String,
    precio_unitario_detalle_cotizacion: Number,
    unidades_detalle_cotizacion: Number,
    precio_total_detalle_cotizacion: Number,
    costo_smart_detalle_cotizacion: Number
});
