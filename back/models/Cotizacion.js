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
  
  // Tipo de pago 
  forma_pago: { 
    type: String, 
    enum: ['Contado', 'Financiado'], 
    required: true,
    description: "Tipo de pago/contrato" 
  },

  pago_contado_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pago',
    description: "Referencia al pago completo cuando es de contado"
  },
  
  // Campos específicos para financiado
  financiamiento: {
    anticipo_solicitado: { 
      type: Number,
      min: 0,
      description: "Anticipo requerido" 
    },
    plazo_semanas: { 
      type: Number,
      min: 0,
      description: "Plazo en semanas" 
    },
    pago_semanal: { 
      type: Number,
      description: "Monto de pago semanal calculado" 
    },
    saldo_restante: { 
      type: Number,
      description: "Saldo pendiente calculado" 
    }
  },
  
  // Seguimiento de servicio 
  estado_servicio: {
    type: String,
    enum: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'],
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
  timestamps: true, 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

// Middleware para cálculos automáticos
cotizacionSchema.pre('save', async function(next) {
  try {
    // Calcular costos por ítem
    this.detalles.forEach(item => {
      item.inversion = item.costo_materiales + item.costo_mano_obra;
      item.precio_con_utilidad = item.inversion * (1 + (item.utilidad_esperada || 0)/100);
    });

    // Calcular totales globales 
    this.subtotal = this.detalles.reduce((sum, item) => sum + item.precio_con_utilidad, 0);
    this.iva = this.subtotal * 0.16; // IVA del 16%
    this.precio_venta = this.subtotal + this.iva;

    // Validaciones básicas
    if (!['Contado', 'Financiado'].includes(this.forma_pago)) {
      throw new Error('Forma de pago inválida');
    }

    // Financiamiento con tasa del 34% 
    if (this.forma_pago === 'Financiado') {
      // Validaciones específicas de financiamiento
      if (!this.financiamiento?.plazo_semanas || this.financiamiento.plazo_semanas <= 0) {
        throw new Error('Plazo de financiamiento inválido (mínimo 1 semana)');
      }

      // Aplicar tasa del 34% al precio inicial
      const tasaFinanciamiento = 0.34;
      const cargoFinanciero = this.precio_venta * tasaFinanciamiento;
      
      // Actualizar precio final
      this.precio_venta += cargoFinanciero;
      this.cargo_financiero = {
        tasa: tasaFinanciamiento,
        monto: cargoFinanciero,
        descripcion: "Cargo por financiamiento (34%)"
      };

      // Calcular saldos
      const anticipo = this.financiamiento.anticipo_solicitado || 0;
      
      if (anticipo > this.precio_venta) {
        throw new Error('El anticipo no puede exceder el precio total');
      }

      this.financiamiento.saldo_restante = this.precio_venta - anticipo;
      this.financiamiento.pago_semanal = Number(
        (this.financiamiento.saldo_restante / this.financiamiento.plazo_semanas).toFixed(2)
      );

      // PREPARAR datos para pago inicial (se creará en el controlador)
      this._pagoInicial = {
        monto: anticipo,
        tipo_pago: 'Anticipo',
        saldo_pendiente: this.financiamiento.saldo_restante
      };

      // Limpiar referencia a pago de contado
      this.pago_contado_id = undefined;

      // Calcular fecha de término si existe fecha de inicio
      if (this.financiamiento.fecha_inicio) {
        const fechaTermino = new Date(this.financiamiento.fecha_inicio);
        fechaTermino.setDate(fechaTermino.getDate() + (this.financiamiento.plazo_semanas * 7));
        this.financiamiento.fecha_termino = fechaTermino;
      }
    } 
    // Contado
    else {
      // Validación para pago de contado
      if (this.precio_venta <= 0) {
        throw new Error('El precio de venta debe ser mayor a cero para pagos de contado');
      }

      // Limpiar datos de financiamiento
      this.financiamiento = undefined;
      
      // PREPARAR datos para pago de contado (se creará en el controlador)
      this._pagoInicial = {
        monto: this.precio_venta,
        tipo_pago: 'Contado',
        saldo_pendiente: 0
      };
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Middleware post-save para manejar errores en referencias
cotizacionSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Error de duplicado en la cotización'));
  } else if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    next(new Error(messages.join(', ')));
  } else {
    next(error);
  }
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

// Virtual para acceder fácilmente al pago de contado
cotizacionSchema.virtual('pago_contado', {
  ref: 'Pago',
  localField: 'pago_contado_id',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Cotizacion', cotizacionSchema);