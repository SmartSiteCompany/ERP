// src/models/Pago.js
const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  cliente_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true 
  },
  cotizacion_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cotizacion', 
    required: true 
  },
  fecha_pago: { 
    type: Date, 
    default: Date.now,
    description: "Fecha en que se realizó el pago" 
  },
  monto_pago: { 
    type: Number, 
    required: true,
    min: 0.01,
    description: "Monto del pago realizado" 
  },
  saldo_pendiente: { 
    type: Number, 
    required: false,
    description: "Saldo restante después de este pago" 
  },
  tipo_pago: {
    type: String,
    enum: ['Contado', 'Financiado', 'Anticipo', 'Abono'],
    required: false,
    description: "Tipo de pago realizado"
  },
  metodo_pago: {
    type: String,
    enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque'],
    required: false,
    description: "Método de pago utilizado"
  },
  referencia: {
    type: String,
    description: "Número de referencia/folio del pago"
  },
  observaciones: {
    type: String,
    description: "Notas adicionales sobre el pago"
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Pago', pagoSchema);