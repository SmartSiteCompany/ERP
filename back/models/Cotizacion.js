// src/models/Cotizacion.js
const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
  nombre_cotizacion: { type: String, required: true },
  fecha_cotizacion: { type: Date, default: Date.now },
  forma_pago: { type: String, enum: ['Financiado', 'Contado'], required: true },
  precio_venta: { type: Number, required: true },
  anticipo_solicitado: { type: Number, required: true },
  filial_id: { type: mongoose.Schema.Types.ObjectId,ref: 'Filial', required: true },// Modificacion de filial en cotizacion
  servicio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServicioFinanciado', required: false },
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  detalles: [
    {
      descripcion: { type: String, required: true },
      costo_materiales: { type: Number, required: true },
      costo_mano_obra: { type: Number, required: true },
      inversion: { type: Number, required: true }, // costo_materiales + costo_mano_obra
      utilidad_esperada: { type: Number, required: true }, // precio_venta - inversion
    },
  ],
});

module.exports = mongoose.model('Cotizacion', cotizacionSchema);