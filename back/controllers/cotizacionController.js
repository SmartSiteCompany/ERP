// src/controllers/cotizacionController.js
const Cotizacion = require('../models/Cotizacion');
const EstadoCuenta = require('../models/EstadoCuenta');
const Pago = require('../models/Pago');
const PaymentService = require('../services/PaymetService');

// Función para manejo de errores consistente
const handleError = (res, error, defaultMessage) => {
  const statusCode = error.name === 'ValidationError' ? 400 : 500;
  res.status(statusCode).json({ 
    error: defaultMessage,
    details: error.message,
    ...(error.errors && { validationErrors: error.errors })
  });
};

// Función auxiliar para obtener cotización con relaciones
const obtenerCotizacionCompleta = async (cotizacionId) => {
  return Cotizacion.findById(cotizacionId)
    .populate('cliente_id', 'nombre email telefono')
    .populate('filial_id', 'nombre_filial direccion')
    .populate('pago_contado_id', 'monto_pago metodo_pago fecha_pago')
    .populate({
      path: 'financiamiento.pagos',
      select: 'monto_pago fecha_pago estado'
    });
};

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
    handleError(res, error, 'Error al obtener cotizaciones');
  }
};

const obtenerCotizacionPorId = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id)
      .populate('cliente_id', 'nombre email telefono')
      .populate('filial_id', 'nombre_filial direccion')
      .populate('pago_contado_id', 'monto_pago metodo_pago fecha_pago')
      .populate({
        path: 'financiamiento.pagos',
        select: 'monto_pago fecha_pago estado'
      });
      
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(cotizacion);
  } catch (error) {
    handleError(res, error, 'Error al obtener la cotización');
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

    // Validar método de pago para financiamiento
    if (req.body.forma_pago === 'Financiado') {
      if (!req.body.metodo_pago) {
        return res.status(400).json({
          error: 'Datos incompletos',
          message: 'Método de pago es requerido para financiamiento'
        });
      }
      if (!req.body.financiamiento) {
        return res.status(400).json({
          error: 'Datos incompletos',
          message: 'Datos de financiamiento son requeridos'
        });
      }
    }

    // Preparar datos de la cotización
    const cotizacionData = {
      ...req.body,
      vendedor: req.body.vendedor || req.user?.nombre || 'Sistema'
    };

    // Crear y guardar la cotización
    const cotizacion = new Cotizacion(cotizacionData);
    await cotizacion.save();

    // Manejo de pagos según tipo
    if (cotizacion.forma_pago === 'Contado') {
      await PaymentService.createPayment({
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion._id,
        monto_pago: cotizacion.precio_venta,
        tipo_pago: 'Contado',
        metodo_pago: req.body.metodo_pago || 'Efectivo',
        saldo_pendiente: 0,
        referencia: `CONTADO-${cotizacion._id.toString().slice(-6)}`
      });
    } else if (cotizacion.forma_pago === 'Financiado') {
      // Crear pago inicial (anticipo)
      await PaymentService.createInitialPayment(cotizacion, req.body.metodo_pago);
      
      // Crear estado de cuenta
      await EstadoCuenta.create({
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion._id,
        saldo_inicial: cotizacion.precio_venta,
        saldo_actual: cotizacion.precio_venta,
        pago_semanal: cotizacion.financiamiento.pago_semanal,
        fecha_vencimiento: cotizacion.financiamiento.fecha_termino
      });
    }

    // Obtener cotización completa con relaciones
    const cotizacionCreada = await obtenerCotizacionCompleta(cotizacion._id);

    res.status(201).json({
      message: 'Cotización creada exitosamente',
      cotizacion: cotizacionCreada,
      [cotizacion.forma_pago === 'Contado' ? 'pago_contado' : 'pago_inicial']: {
        realizado: true,
        monto: cotizacion.forma_pago === 'Contado' 
          ? cotizacion.precio_venta 
          : cotizacion.financiamiento?.anticipo_solicitado || 0
      }
    });

  } catch (error) {
    handleError(res, error, 'Error al crear la cotización');
  }
};

const aprobarCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findByIdAndUpdate(
      req.params.id,
      { estado: 'Aprobada' },
      { new: true }
    );

    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    if (cotizacion.forma_pago === 'Financiado') {
      await PaymentService.generateScheduledPayments(cotizacion._id);
    }

    res.json(cotizacion);
  } catch (error) {
    handleError(res, error, 'Error al aprobar cotización');
  }
};

const actualizarCotizacion = async (req, res) => {
  try {
    const cotizacionExistente = await Cotizacion.findById(req.params.id);
    
    if (!cotizacionExistente) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    if (cotizacionExistente.estado === 'Completada') {
      return res.status(400).json({ 
        error: 'No se puede modificar una cotización completada' 
      });
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
    handleError(res, error, 'Error al actualizar cotización');
  }
};

const eliminarCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    if (cotizacion.estado_servicio !== 'Pendiente') {
      return res.status(400).json({ 
        error: 'No se puede eliminar una cotización con servicios activos' 
      });
    }
    
    await Cotizacion.findByIdAndDelete(req.params.id);
    await PaymentService.deletePaymentsByQuotation(cotizacion._id);
    
    res.json({ message: 'Cotización eliminada correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar cotización');
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
    
    cotizacion.estado_servicio = 'EnProceso';
    cotizacion.fecha_inicio_servicio = new Date();
    
    if (cotizacion.forma_pago === 'Financiado' && cotizacion.financiamiento) {
      cotizacion.financiamiento.fecha_inicio = new Date();
    }
    
    await cotizacion.save();
    
    const cotizacionActualizada = await Cotizacion.findById(cotizacion._id)
      .populate('cliente_id', 'nombre email')
      .populate('filial_id', 'nombre_filial');
      
    res.json(cotizacionActualizada);
  } catch (error) {
    handleError(res, error, 'Error al activar servicio');
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
    handleError(res, error, 'Error al completar servicio');
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
    
    const pago = await PaymentService.createPayment({
      cotizacion_id: cotizacion._id,
      cliente_id: cotizacion.cliente_id,
      monto_pago: monto,
      metodo_pago: metodo_pago || 'Efectivo',
      tipo_pago: 'Abono',
      fecha_pago: new Date()
    });
    
    // Actualizar saldo en la cotización
    cotizacion.financiamiento.saldo_restante -= monto;
    
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
    handleError(res, error, 'Error al registrar pago');
  }
};

const obtenerHistorialPagos = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const pagos = await PaymentService.getPaymentsByQuotation(req.params.id);
      
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
    handleError(res, error, 'Error al obtener historial de pagos');
  }
};

const obtenerServiciosPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const { forma_pago } = req.query;

    const filtro = { 
      estado_servicio: estado,
      ...(forma_pago && { forma_pago })
    };

    const cotizaciones = await Cotizacion.find(filtro)
      .populate('cliente_id', 'nombre telefono')
      .populate('filial_id', 'nombre_filial')
      .sort({ fecha_inicio_servicio: -1 });
    
    res.json(cotizaciones);
  } catch (error) {
    handleError(res, error, 'Error al obtener servicios por estado');
  }
};

const verificarCotizacion = async (req, res, next) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    req.cotizacion = cotizacion;
    next();
  } catch (error) {
    handleError(res, error, 'Error al verificar cotización');
  }
};

module.exports = {
  obtenerCotizaciones,
  obtenerCotizacionPorId,
  crearCotizacion,
  aprobarCotizacion,
  actualizarCotizacion,
  eliminarCotizacion,
  activarServicio,
  completarServicio,
  registrarPago,
  obtenerHistorialPagos,
  obtenerServiciosPorEstado,
  verificarCotizacion
};