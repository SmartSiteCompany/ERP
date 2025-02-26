// Productos y Servicios
const ProductoServicioSchema = new mongoose.Schema({
    id_productoservicio: { type: Number, required: true, unique: true },
    codigo_productoservicio: String,
    descripcion_productoservicio: String,
    producto_productoservicio: Boolean,
    categoria_productoservicio: String,
    servicio_productoservicio: Boolean,
    precio_compra_productoservicio: Number,
    sin_financiamiento_productoservicio: Number,
    con_financiamiento_productoservicio: Number,
    seccion_productoservicio: String,
    subseccion_productoservicio: String,
    status_productoservicio: String
});
