// src/controllers/cotizacionController.js
const Cotizacion = require('../models/Cotizacion');
const Pago = require('../models/Pago');
const EstadoCuenta = require('../models/EstadoCuenta');

// Operaciones CRUD básicas para cotizaciones
const obtenerCotizaciones = async (req, res) => {
  try {
    const { estado_servicio, forma_pago } = req.query;
    
    const filtro = {};
    if (estado_servicio) filtro.estado_servicio = estado_servicio;
    if (forma_pago) filtro.forma_pago = forma_pago;

    const cotizaciones = await Cotizacion.find(filtro)
      .populate('cliente_id', 'nombre email')
      .populate('filial_id', 'nombre_filial')
      .sort({ fecha_cotizacion: -1 });

    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerCotizacionPorId = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id)
      .populate('cliente_id', 'nombre email telefono')
      .populate('filial_id', 'nombre_filial direccion');
      
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearCotizacion = async (req, res) => {
  try {
    // Validación básica de datos requeridos
    if (!req.body.detalles || req.body.detalles.length === 0) {
      return res.status(400).json({ 
        error: 'Datos incompletos',
        message: 'Debe incluir al menos un item en detalles' 
      });
    }

    // Preparar datos de la cotización
    const cotizacionData = {
      ...req.body,
      vendedor: req.body.vendedor || req.user?.nombre || 'Sistema',
      // El precio_venta se calculará en el middleware
    };

    const cotizacion = new Cotizacion(cotizacionData);
    
    // Guardamos primero para obtener el _id y cálculos automáticos
    await cotizacion.save(); 

        // Crear EstadoCuenta inicial si es financiado
        if (cotizacion.forma_pago === 'Financiado') {
          const estadoCuenta = new EstadoCuenta({
            cliente_id: cotizacion.cliente_id,
            cotizacion_id: cotizacion._id,
            saldo_inicial: cotizacion.precio_venta,
            saldo_actual: cotizacion.precio_venta,
            pago_semanal: cotizacion.financiamiento.pago_semanal,
            fecha_vencimiento: cotizacion.financiamiento.fecha_termino
          });
          await estadoCuenta.save();
        }

    // Manejo de pago de contado si aplica
    if (cotizacion.forma_pago === 'Contado') {
      const pagoContado = new Pago({
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion._id,
        monto_pago: cotizacion.precio_venta,
        tipo_pago: 'Contado',
        metodo_pago: req.body.metodo_pago || 'Efectivo',
        saldo_pendiente: 0,
        referencia: req.body.referencia_pago || `CONTADO-${cotizacion._id.toString().slice(-6)}`
      });
      
      await pagoContado.save();
      
      // Actualizar la cotización con la referencia al pago
      cotizacion.pago_contado_id = pagoContado._id;
      await cotizacion.save();
    }

    // Obtener la cotización completa con relaciones
    const cotizacionCreada = await Cotizacion.findById(cotizacion._id)
      .populate('cliente_id', 'nombre email telefono')
      .populate('filial_id', 'nombre_filial direccion')
      .populate('pago_contado_id', 'monto_pago metodo_pago fecha_pago');

    res.status(201).json({
      message: 'Cotización creada exitosamente',
      cotizacion: cotizacionCreada,
      // Incluir información útil para el frontend
      pago_contado: cotizacion.forma_pago === 'Contado' ? {
        realizado: true,
        monto: cotizacion.precio_venta
      } : { realizado: false }
    });

  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      details: error.errors,
      message: 'Error al crear la cotización'
    });
  }
};

const actualizarCotizacion = async (req, res) => {
  try {
    // Bloquear actualización si el estado no lo permite
    const cotizacionExistente = await Cotizacion.findById(req.params.id);
    if (!cotizacionExistente) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    if (cotizacionExistente.estado === 'Completada') {
      return res.status(400).json({ error: 'No se puede modificar una cotización completada' });
    }

    const cotizacion = await Cotizacion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true, 
        runValidators: true 
      }
    )
    .populate('cliente_id', 'nombre email')
    .populate('filial_id', 'nombre_filial');
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(cotizacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Validar que no tenga servicios asociados
    if (cotizacion.estado_servicio !== 'Pendiente') {
      return res.status(400).json({ 
        error: 'No se puede eliminar una cotización con servicios activos' 
      });
    }
    
    await Cotizacion.findByIdAndDelete(req.params.id);
    await Pago.deleteMany({ cotizacion_id: cotizacion._id });
    
    res.json({ message: 'Cotización eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Operaciones de servicio
const activarServicio = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    if (cotizacion.estado !== 'Aprobada') {
      return res.status(400).json({ 
        error: 'La cotización debe estar aprobada para activar el servicio' 
      });
    }
    
    if (cotizacion.estado_servicio !== 'Pendiente') {
      return res.status(400).json({ 
        error: 'El servicio ya ha sido activado previamente' 
      });
    }
    
    // Actualizar para activar el servicio
    cotizacion.estado_servicio = 'EnProceso';
    cotizacion.fecha_inicio_servicio = new Date();
    
    // Si es financiado, establecer fecha de inicio en financiamiento
    if (cotizacion.forma_pago === 'Financiado' && cotizacion.financiamiento) {
      cotizacion.financiamiento.fecha_inicio = new Date();
    }
    
    await cotizacion.save();
    
    // Devolver cotización actualizada con relaciones
    const cotizacionActualizada = await Cotizacion.findById(cotizacion._id)
      .populate('cliente_id', 'nombre email')
      .populate('filial_id', 'nombre_filial');
      
    res.json(cotizacionActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completarServicio = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    if (cotizacion.estado_servicio !== 'EnProceso') {
      return res.status(400).json({ 
        error: 'El servicio debe estar en proceso para completarlo' 
      });
    }
    
    // Validar que no queden pagos pendientes para financiado
    if (cotizacion.forma_pago === 'Financiado' && 
        cotizacion.financiamiento.saldo_restante > 0) {
      return res.status(400).json({ 
        error: 'No se puede completar el servicio con saldo pendiente' 
      });
    }
    
    cotizacion.estado_servicio = 'Completado';
    cotizacion.estado = 'Completada';
    cotizacion.fecha_fin_servicio = new Date();
    
    await cotizacion.save();
    
    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Operaciones de pagos para servicios financiados
const registrarPago = async (req, res) => {
  try {
    const { monto, metodo_pago } = req.body;
    
    if (!monto || monto <= 0) {
      return res.status(400).json({ error: 'Monto de pago inválido' });
    }

    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    if (cotizacion.forma_pago !== 'Financiado') {
      return res.status(400).json({ 
        error: 'Solo se pueden registrar pagos para servicios financiados' 
      });
    }
    
    if (cotizacion.estado_servicio !== 'EnProceso') {
      return res.status(400).json({ 
        error: 'El servicio debe estar activo para registrar pagos' 
      });
    }
    
    // Crear registro de pago
    const pago = new Pago({
      cotizacion_id: cotizacion._id,
      cliente_id: cotizacion.cliente_id,
      monto,
      metodo_pago: metodo_pago || 'Efectivo',
      fecha: new Date()
    });
    
    await pago.save();
    
    // Actualizar saldo en la cotización
    cotizacion.financiamiento.saldo_restante -= monto;
    
    // Verificar si el servicio ha sido liquidado
    if (cotizacion.financiamiento.saldo_restante <= 0) {
      cotizacion.estado_servicio = 'Completado';
      cotizacion.fecha_fin_servicio = new Date();
    }
    
    await cotizacion.save();
    
    res.json({
      cotizacion: await Cotizacion.findById(cotizacion._id)
        .populate('cliente_id', 'nombre')
        .populate('filial_id', 'nombre_filial'),
      pago
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerHistorialPagos = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const pagos = await Pago.find({ cotizacion_id: req.params.id })
      .sort({ fecha: -1 });
      
    res.json({
      cotizacion: {
        _id: cotizacion._id,
        nombre_cotizacion: cotizacion.nombre_cotizacion,
        precio_venta: cotizacion.precio_venta,
        saldo_restante: cotizacion.financiamiento?.saldo_restante || 0
      },
      pagos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener servicios por estado
const obtenerServiciosPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const { forma_pago } = req.query;

    const filtro = { 
      estado_servicio: estado,
      ...(forma_pago && { forma_pago }) // Filtro opcional por tipo de pago
    };

    const cotizaciones = await Cotizacion.find(filtro)
      .populate('cliente_id', 'nombre telefono')
      .populate('filial_id', 'nombre_filial')
      .sort({ fecha_inicio_servicio: -1 });
    
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerCotizaciones,
  obtenerCotizacionPorId,
  crearCotizacion,
  actualizarCotizacion,
  eliminarCotizacion,
  activarServicio,
  completarServicio,
  registrarPago,
  obtenerHistorialPagos,
  obtenerServiciosPorEstado
};