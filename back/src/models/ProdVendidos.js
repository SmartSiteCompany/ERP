// Modelo de Producto Vendido
const ProductoVendidoSchema = new mongoose.Schema({
    codigo: String,
    descripcion: String,
    preciosmart: Number,
    cantidad: Number,
    preciototalsmart: Number,
    precioventa: Number,
    preciototalventa: Number,
    existente: Boolean,
    cotizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion' }
}, { timestamps: true });
const ProductoVendido = mongoose.model('ProductoVendido', ProductoVendidoSchema);