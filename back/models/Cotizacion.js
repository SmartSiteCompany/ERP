const mongoose = require('mongoose');
const { 
  estadosCotizacion, 
  formasPago,
  estadosServicio,
  tiposPagoFinanciado
} = require('../utils/constantes');

const cotizacionSchema = new mongoose.Schema({
  nombre_cotizacion: { 
    type: String, 
    required: [true, 'El nombre de la cotización es requerido'],
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres'],
    description: "Nombre descriptivo de la cotización"
  },
  
  fecha_cotizacion: { 
    type: Date, 
    default: Date.now,
    description: "Fecha de creación automática" 
  },
  
  valido_hasta: { 
    type: Date, 
    required: [true, 'La fecha de validez es requerida'],
    validate: {
      validator: function(value) {
        return value > this.fecha_cotizacion;
      },
      message: 'La fecha de validez debe ser posterior a la fecha de creación'
    },
    description: "Fecha de validez de la cotización" 
  },

  // ESTADOS Y FLUJOS
  estado: { 
    type: String, 
    enum: {
      values: estadosCotizacion,
      message: 'Estado de cotización no válido'
    },
    default: 'Borrador',
    description: "Estado del flujo de cotización"
  },
  
  estado_servicio: {
    type: String,
    enum: {
      values: estadosServicio,
      message: 'Estado de servicio no válido'
    },
    default: 'Pendiente',
    description: "Estado del servicio asociado"
  },

  // RELACIONES PRINCIPALES
  cliente_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: [true, 'El cliente es requerido'],
    description: "Referencia al cliente" 
  },
  
  vendedor_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El vendedor es requerido'],
    description: "Usuario que creó la cotización"
  },
  
  filial_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Filial', 
    required: [true, 'La filial es requerida'],
    description: "Referencia a la filial/sucursal" 
  },

  // DETALLES Y CÁLCULOS
  detalles: {
    type: [{
      descripcion: { 
        type: String, 
        required: [true, 'La descripción del ítem es requerida'],
        maxlength: [200, 'La descripción no puede exceder 200 caracteres']
      },
      costo_materiales: { 
        type: Number, 
        required: true,
        min: [0, 'El costo de materiales no puede ser negativo'],
        description: "Costo de materiales" 
      },
      costo_mano_obra: { 
        type: Number, 
        required: true,
        min: [0, 'El costo de mano de obra no puede ser negativo'],
        description: "Costo de mano de obra" 
      },
      utilidad_esperada: { 
        type: Number, 
        default: 0,
        min: [0, 'La utilidad no puede ser negativa'],
        max: [100, 'La utilidad no puede exceder el 100%'],
        description: "Porcentaje de utilidad esperada" 
      },
      inversion_total: {
        type: Number,
        description: "Total calculado (materiales + mano obra)"
      },
      precio_venta: {
        type: Number,
        description: "Precio con utilidad aplicada"
      }
    }],
    required: true,
    validate: {
      validator: array => array.length > 0,
      message: 'Debe incluir al menos un ítem en la cotización'
    }
  },

  // TOTALES GLOBALES
  subtotal: { 
    type: Number,
    min: 0,
    description: "Subtotal antes de impuestos" 
  },
  
  iva: { 
    type: Number,
    min: 0,
    description: "Monto de IVA calculado" 
  },
  
  precio_venta: { 
    type: Number,
    min: 0,
    description: "Precio total con utilidad e impuestos" 
  },

  // PAGO Y FINANCIAMIENTO
  forma_pago: { 
    type: String, 
    enum: {
      values: formasPago,
      message: 'Forma de pago no válida'
    },
    required: [true, 'La forma de pago es requerida'],
    description: "Tipo de pago/contrato" 
  },

  pago_contado_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pago',
    description: "Referencia al pago completo cuando es de contado"
  },

  financiamiento: {
    anticipo_solicitado: { 
      type: Number,
      min: [0, 'El anticipo no puede ser negativo'],
      description: "Anticipo requerido" 
    },
    plazo_semanas: { 
      type: Number,
      min: [1, 'El plazo mínimo es 1 semana'],
      description: "Plazo en semanas" 
    },
    pago_semanal: { 
      type: Number,
      min: [0, 'El pago semanal no puede ser negativo'],
      description: "Monto de pago semanal calculado" 
    },
    saldo_restante: { 
      type: Number,
      min: [0, 'El saldo no puede ser negativo'],
      description: "Saldo pendiente calculado" 
    },
    fecha_inicio: {
      type: Date,
      description: "Fecha de inicio del financiamiento"
    },
    fecha_termino: {
      type: Date,
      description: "Fecha estimada de término"
    },
    pagos_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pago',
      description: "Lista de pagos asociados al financiamiento"
    }],
    tasa_interes: {
      type: Number,
      default: 0.34, // 34%
      description: "Tasa de interés aplicada"
    }
  },

  //SEGUIMIENTO
  fecha_inicio_servicio: { 
    type: Date,
    description: "Fecha real de inicio",
    validate: {
      validator: function(value) {
        if (this.estado_servicio === 'En Proceso' && !value) {
          return false;
        }
        return true;
      },
      message: 'La fecha de inicio es requerida cuando el servicio está en proceso'
    }
  },
  
  fecha_fin_servicio: { 
    type: Date,
    description: "Fecha real de finalización",
    validate: {
      validator: function(value) {
        if (this.estado_servicio === 'Completado' && !value) {
          return false;
        }
        if (value && this.fecha_inicio_servicio && value < this.fecha_inicio_servicio) {
          return false;
        }
        return true;
      },
      message: 'La fecha de fin debe ser posterior al inicio'
    }
  },

  // METADATA
  creado_por: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    description: "Usuario que creó el registro"
  },

  actualizado_por: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    description: "Último usuario que modificó el registro"
  }

}, {
  timestamps: true, // Crea createdAt y updatedAt automáticamente
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v; // Eliminar versión de mongoose
      return ret;
    }
  },
  toObject: { virtuals: true }
});

//ÍNDICES
cotizacionSchema.index({ cliente_id: 1, estado: 1 });
cotizacionSchema.index({ filial_id: 1, fecha_cotizacion: -1 });
cotizacionSchema.index({ estado_servicio: 1, fecha_inicio_servicio: 1 });
cotizacionSchema.index({ 'financiamiento.fecha_termino': 1 });

//MIDDLEWARES
/**
 * Hook pre-save para cálculos automáticos y validaciones
 */
cotizacionSchema.pre('save', async function(next) {
  try {
    // Cálculos de ítems
    this.detalles.forEach(item => {
      item.inversion_total = item.costo_materiales + item.costo_mano_obra;
      item.precio_venta = item.inversion_total * (1 + (item.utilidad_esperada || 0)/100);
    });

    // Cálculos globales
    this.subtotal = this.detalles.reduce((sum, item) => sum + item.precio_venta, 0);
    this.iva = parseFloat((this.subtotal * 0.16).toFixed(2)); // IVA 16%
    this.precio_venta = parseFloat((this.subtotal + this.iva).toFixed(2));

    // Lógica específica por forma de pago
    if (this.forma_pago === 'Financiado') {
      await this._handleFinanciamiento();
    } else {
      this._handleContado();
    }

    // Validación de estados
    this._validateStatusChanges();

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Maneja la lógica de financiamiento
 */
cotizacionSchema.methods._handleFinanciamiento = function() {
  // Validación de campos requeridos
  if (!this.financiamiento?.plazo_semanas || this.financiamiento.plazo_semanas <= 0) {
    throw new Error('Plazo de financiamiento inválido (mínimo 1 semana)');
  }

  // Aplicar tasa de interés
  const tasa = this.financiamiento.tasa_interes || 0.34;
  const cargoFinanciero = parseFloat((this.precio_venta * tasa).toFixed(2));
  this.precio_venta = parseFloat((this.precio_venta + cargoFinanciero).toFixed(2));

  // Configurar financiamiento
  const anticipo = this.financiamiento.anticipo_solicitado || 0;
  this.financiamiento.saldo_restante = parseFloat((this.precio_venta - anticipo).toFixed(2));
  this.financiamiento.pago_semanal = parseFloat((
    this.financiamiento.saldo_restante / this.financiamiento.plazo_semanas
  ).toFixed(2));

  // Calcular fechas si aplica
  if (this.financiamiento.fecha_inicio) {
    const fechaTermino = new Date(this.financiamiento.fecha_inicio);
    fechaTermino.setDate(fechaTermino.getDate() + (this.financiamiento.plazo_semanas * 7));
    this.financiamiento.fecha_termino = fechaTermino;
  }

  // Limpiar pago de contado si existe
  this.pago_contado_id = undefined;
};

/**
 * Maneja la lógica de pago de contado
 */
cotizacionSchema.methods._handleContado = function() {
  // Validación básica
  if (this.precio_venta <= 0) {
    throw new Error('El precio de venta debe ser mayor a cero para pagos de contado');
  }

  // Limpiar financiamiento
  this.financiamiento = undefined;
};

/**
 * Valida cambios de estado
 */
cotizacionSchema.methods._validateStatusChanges = function() {
  // Validar transición de estados de servicio
  if (this.estado_servicio === 'En Proceso' && !this.fecha_inicio_servicio) {
    this.fecha_inicio_servicio = new Date();
  }

  if (this.estado_servicio === 'Completado' && !this.fecha_fin_servicio) {
    this.fecha_fin_servicio = new Date();
  }
};

// VIRTUALS
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

cotizacionSchema.virtual('pago_contado', {
  ref: 'Pago',
  localField: 'pago_contado_id',
  foreignField: '_id',
  justOne: true
});

cotizacionSchema.virtual('pagos_financiamiento', {
  ref: 'Pago',
  localField: 'financiamiento.pagos_ids',
  foreignField: '_id'
});

cotizacionSchema.virtual('estado_cuenta', {
  ref: 'EstadoCuenta',
  localField: '_id',
  foreignField: 'cotizacion_id',
  justOne: true
});

/**
 * Busca cotizaciones por estado y rango de fechas
 */
cotizacionSchema.statics.findByStatusAndDateRange = function(status, startDate, endDate) {
  return this.find({
    estado: status,
    fecha_cotizacion: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('cliente', 'nombre email');
};

/**
 * Calcula el progreso del servicio
 */
cotizacionSchema.methods.calcularProgreso = function() {
  if (this.estado_servicio === 'Completado') return 100;
  if (!this.fecha_inicio_servicio) return 0;
  
  const totalDays = (this.fecha_fin_servicio - this.fecha_inicio_servicio) / (1000 * 60 * 60 * 24);
  const daysPassed = (new Date() - this.fecha_inicio_servicio) / (1000 * 60 * 60 * 24);
  
  return Math.min(100, Math.round((daysPassed / totalDays) * 100));
};

module.exports = mongoose.model('Cotizacion', cotizacionSchema);