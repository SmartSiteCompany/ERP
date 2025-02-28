const mongoose = require('mongoose');

const ProductoServicioSchema = new mongoose.Schema({
  codigo_productoservicio: { type: String, required: true, unique: true },
  descripcion_productoservicio: { type: String, required: true },
  producto_productoservicio: Boolean,
  categoria_productoservicio: String,
  servicio_productoservicio: Boolean,
  precio_compra_productoservicio: Number,
  sin_financiamiento_productoservicio: Number,
  con_financiamiento_productoservicio: Number,
  seccion_productoservicio: String,
  subseccion_productoservicio: String,
  status_productoservicio: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

module.exports = mongoose.model('ProductoServicio', ProductoServicioSchema);
