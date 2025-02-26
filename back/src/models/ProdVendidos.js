// Productos Vendidos
const ProductoVendidoSchema = new mongoose.Schema({
    id_producto_vendido: { type: Number, required: true, unique: true },
    codigo: String,
    descripcion: String,
    preciosmart: Number,
    cantidad: Number,
    preciototalsmart: Number,
    precioventa: Number,
    preciototalventa: Number,
    existente: Boolean,
    id_cotizacion: { type: Number, ref: 'Cotizacion' }
});
