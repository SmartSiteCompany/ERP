
// Cotizaciones
const CotizacionSchema = new mongoose.Schema({
    id_cotizacion: { type: Number, required: true, unique: true },
    fecha_cotizacion: Date,
    validez_cotizacion: Date,
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
    id_cliente: { type: Number, ref: 'Cliente' }
});
