const mongoose = require('mongoose');

const estadoCuentaSchema = new mongoose.Schema({
  cliente_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true 
  },
  cotizacion_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cotizacion', 
    required: true,
    unique: true // Solo un estado de cuenta por cotización
  },
  pagos_ids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pago' 
  }],
  fecha_creacion: { 
    type: Date, 
    default: Date.now 
  },
  fecha_vencimiento: { 
    type: Date,
    description: "Fecha límite para liquidar el saldo (si aplica)" 
  },
  saldo_inicial: { 
    type: Number, 
    required: true,
    min: 0,
    description: "Monto total a pagar inicialmente" 
  },
  pagos_total: { 
    type: Number, 
    default: 0,
    min: 0,
    description: "Suma acumulada de todos los pagos registrados" 
  },
  saldo_actual: { 
    type: Number, 
    required: true,
    min: 0,
    description: "Saldo pendiente (saldo_inicial - pagos_total)" 
  },
  pago_semanal: { 
    type: Number,
    description: "Monto a pagar por semana (para financiamientos)" 
  },
  intereses_moratorios: { 
    type: Number,
    default: 0,
    description: "Intereses acumulados por atrasos" 
  },
  estado: { 
    type: String,
    enum: ['Activo', 'Pagado', 'Vencido', 'Cancelado'],
    default: 'Activo',
    description: "Estado del flujo de pagos" 
  }
}, { 
  timestamps: true, // Crea createdAt y updatedAt automáticamente
  toJSON: { virtuals: true } 
});

// Middleware para calcular saldo_actual antes de guardar
estadoCuentaSchema.pre('save', function(next) {
  this.saldo_actual = this.saldo_inicial - this.pagos_total;
  
  // Actualizar estado si se liquida el saldo
  if (this.saldo_actual <= 0) {
    this.estado = 'Pagado';
    this.saldo_actual = 0; // Evitar valores negativos
  }
  
  // Marcar como vencido si hay fecha_vencimiento y aún está activo
  if (this.fecha_vencimiento && this.fecha_vencimiento < new Date() && this.estado === 'Activo') {
    this.estado = 'Vencido';
  }
  next();
});

module.exports = mongoose.model('EstadoCuenta', estadoCuentaSchema);