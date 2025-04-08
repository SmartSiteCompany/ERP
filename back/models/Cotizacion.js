// src/models/Cotizacion.js
const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
  // Datos básicos
  numero: { type: String, required: true, unique: true },
  fecha: { type: Date, default: Date.now },
  validoHasta: { type: Date, required: true },
  estado: { 
    type: String, 
    enum: ['Borrador', 'Enviada', 'Aprobada', 'Completada', 'Cancelada'],
    default: 'Borrador'
  },
  
  // Relaciones
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  vendedor: { type: String, required: true }, // Ej: "Raquel Solano Reyes"
  filial: { type: mongoose.Schema.Types.ObjectId, ref: 'Filial', required: true },
  
  // Items y totales
  items: [{
    descripcion: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  subtotal: { type: Number },
  iva: { type: Number },
  total: { type: Number, required: true },
  
  // Tipo de servicio (contado/financiado)
  tipo: { type: String, enum: ['Contado', 'Financiado'], required: true },
  
  // Campos específicos para financiado
  financiamiento: {
    anticipo: { type: Number },
    plazo: { type: Number }, // En semanas
    pagoSemanal: { type: Number },
    saldoRestante: { type: Number }
  },
  
  // Campos específicos para contado
  pagoContado: {
    fechaPago: { type: Date }
  },
  
  // Seguimiento de servicio
  fechaInicioServicio: { type: Date },
  fechaFinServicio: { type: Date },
  estadoServicio: {
    type: String,
    enum: ['Pendiente', 'EnProceso', 'Completado', 'Cancelado'],
    default: 'Pendiente'
  }
});

// Middleware para cálculos automáticos
cotizacionSchema.pre('save', function(next) {
  // Calcular totales de items
  this.subtotal = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  this.iva = this.subtotal * 0.19;
  this.total = this.subtotal + this.iva;
  
  // Cálculos para financiamiento
  if (this.tipo === 'Financiado' && this.financiamiento) {
    this.financiamiento.saldoRestante = this.total - this.financiamiento.anticipo;
    this.financiamiento.pagoSemanal = this.financiamiento.saldoRestante / this.financiamiento.plazo;
  }
  
  next();
});

module.exports = mongoose.model('Cotizacion', cotizacionSchema);