// src/models/Cotizacion.js
const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
  // Datos básicos
  nombre_cotizacion: { 
    type: String, 
    required: true,
    description: "Nombre descriptivo de la cotización"
  },
  fecha_cotizacion: { 
    type: Date, 
    default: Date.now,
    description: "Fecha de creación automática" 
  },
  validoHasta: { 
    type: Date, 
    required: true,
    description: "Fecha de validez de la cotización" 
  },
  estado: { 
    type: String, 
    enum: ['Borrador', 'Enviada', 'Aprobada', 'Completada', 'Cancelada'],
    default: 'Borrador',
    description: "Estado del flujo de cotización"
  },
  
  // Relaciones (actualizadas para usar _id)
  cliente_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true,
    description: "Referencia al cliente" 
  },
  vendedor: { 
    type: String, 
    required: true,
    description: "Nombre del vendedor responsable" 
  },
  filial_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Filial', 
    required: true,
    description: "Referencia a la filial/sucursal" 
  },
  
  // Items (detalles) y totales
  detalles: {
    type: [{
      descripcion: { 
        type: String, 
        required: true,
        description: "Descripción del servicio/producto" 
      },
      costo_materiales: { 
        type: Number, 
        required: true,
        min: 0,
        description: "Costo de materiales" 
      },
      costo_mano_obra: { 
        type: Number, 
        required: true,
        min: 0,
        description: "Costo de mano de obra" 
      },
      utilidad_esperada: { 
        type: Number, 
        default: 0,
        description: "Porcentaje de utilidad esperada" 
      },
      inversion: {
        type: Number,
        description: "Total calculado (materiales + mano obra)"
      }
    }],
    required: true,
    validate: [array => array.length > 0, 'Debe tener al menos un item']
  },
  
  // Totales calculados
  subtotal: { 
    type: Number,
    description: "Subtotal antes de impuestos" 
  },
  iva: { 
    type: Number,
    description: "Monto de IVA calculado" 
  },
  precio_venta: { 
    type: Number,
    description: "Precio total con utilidad e impuestos" 
  },
  
  // Tipo de pago (actualizado para coincidir con Swagger)
  forma_pago: { 
    type: String, 
    enum: ['Contado', 'Financiado'], 
    required: true,
    description: "Tipo de pago/contrato" 
  },
  
  // Campos específicos para financiado (actualizados)
  financiamiento: {
    anticipo_solicitado: { 
      type: Number,
      min: 0,
      description: "Anticipo requerido" 
    },
    plazo_semanas: { 
      type: Number,
      min: 1,
      description: "Plazo en semanas" 
    },
    pago_semanal: { 
      type: Number,
      description: "Monto de pago semanal calculado" 
    },
    saldo_restante: { 
      type: Number,
      description: "Saldo pendiente calculado" 
    },
    fecha_inicio: {
      type: Date,
      description: "Fecha de inicio del servicio"
    },
    fecha_termino: {
      type: Date,
      description: "Fecha estimada de término"
    }
  },
  
  // Campos para contado
  pagoContado: {
    fechaPago: { 
      type: Date,
      description: "Fecha de pago completo" 
    }
  },
  
  // Seguimiento de servicio (actualizado)
  estado_servicio: {
    type: String,
    enum: ['Pendiente', 'EnProceso', 'Completado', 'Cancelado'],
    default: 'Pendiente',
    description: "Estado del servicio asociado"
  },
  fecha_inicio_servicio: { 
    type: Date,
    description: "Fecha real de inicio" 
  },
  fecha_fin_servicio: { 
    type: Date,
    description: "Fecha real de finalización" 
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

// Middleware para cálculos automáticos (actualizado)
cotizacionSchema.pre('save', function(next) {
  // Calcular totales de items
  this.detalles.forEach(item => {
    item.inversion = item.costo_materiales + item.costo_mano_obra;
  });
  
  this.subtotal = this.detalles.reduce((sum, item) => sum + item.inversion, 0);
  this.iva = this.subtotal * 0.19;
  this.precio_venta = this.subtotal + this.iva;
  
  // Cálculos para financiamiento
  if (this.forma_pago === 'Financiado' && this.financiamiento) {
    this.financiamiento.saldo_restante = this.precio_venta - (this.financiamiento.anticipo_solicitado || 0);
    this.financiamiento.pago_semanal = this.financiamiento.saldo_restante / (this.financiamiento.plazo_semanas || 1);
    
    // Si hay fecha de inicio, calcular fecha de término
    if (this.financiamiento.fecha_inicio && this.financiamiento.plazo_semanas) {
      const fechaTermino = new Date(this.financiamiento.fecha_inicio);
      fechaTermino.setDate(fechaTermino.getDate() + (this.financiamiento.plazo_semanas * 7));
      this.financiamiento.fecha_termino = fechaTermino;
    }
  }
  
  next();
});

// Virtuals para relaciones
cotizacionSchema.virtual('cliente', {
  ref: 'Cliente',
  localField: 'cliente_id',
  foreignField: '_id',
  justOne: true
});

cotizacionSchema.virtual('filial', {
  ref: 'Filial',
  localField: 'filial_id',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Cotizacion', cotizacionSchema);