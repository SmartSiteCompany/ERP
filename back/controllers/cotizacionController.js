const mongoose = require('mongoose');
const Cotizacion = require('../models/Cotizacion');
const EstadoCuenta = require('../models/EstadoCuenta');
const PaymentService = require('../services/PaymetService');

// Función para manejo de errores consistente
const handleError = (res, error, defaultMessage) => {
  const statusCode = error.name === 'ValidationError' ? 400 : 500;
  res.status(statusCode).json({ 
    success: false,
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
      model: 'Pago',
      select: 'monto_pago fecha_pago estado tipo_pago',
      options: { strict: true }
    });
};

// Operaciones CRUD básicas para cotizaciones
const obtenerCotizaciones = async (req, res) => {
  try {
    const { estado_servicio, forma_pago, estado } = req.query;
    
    const filtro = {};
    if (estado_servicio) filtro.estado_servicio = estado_servicio;
    if (forma_pago) filtro.forma_pago = forma_pago;
    if (estado) filtro.estado = estado;

    const cotizaciones = await Cotizacion.find(filtro)
      .populate('cliente_id', 'nombre email')
      .populate('filial_id', 'nombre_filial')
      .sort({ fecha_cotizacion: -1 });

    res.json({ success: true, data: cotizaciones });
  } catch (error) {
    handleError(res, error, 'Error al obtener cotizaciones');
  }
};

const obtenerCotizacionPorId = async (req, res) => {
  try {
    const cotizacion = await obtenerCotizacionCompleta(req.params.id);
      
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }
    
    res.json({ success: true, data: cotizacion });
  } catch (error) {
    handleError(res, error, 'Error al obtener la cotización');
  }
};

const crearCotizacion = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Validación básica de datos requeridos
    if (!req.body.detalles || req.body.detalles.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos incompletos',
        message: 'Debe incluir al menos un item en detalles' 
      });
    }

    // Validar método de pago para financiamiento
    if (req.body.forma_pago === 'Financiado') {
      if (!req.body.metodo_pago) {
        return res.status(400).json({
          success: false,
          error: 'Datos incompletos',
          message: 'Método de pago es requerido para financiamiento'
        });
      }
      if (!req.body.financiamiento || !req.body.financiamiento.anticipo_solicitado) {
        return res.status(400).json({
          success: false,
          error: 'Datos incompletos',
          message: 'Datos de financiamiento son requeridos (anticipo_solicitado, plazo_semanas, pago_semanal)'
        });
      }
    }

    // Preparar datos de la cotización
    const cotizacionData = {
      ...req.body,
      vendedor: req.body.vendedor || req.user?.nombre || 'Sistema',
      estado: 'Pendiente',
      estado_servicio: 'Pendiente'
    };

    // Crear y guardar la cotización
    const cotizacion = new Cotizacion(cotizacionData);
    await cotizacion.save({ session });

    // Manejo de pagos según tipo
    if (cotizacion.forma_pago === 'Contado') {
      const pagoContado = await PaymentService.createPayment({
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion._id,
        monto_pago: cotizacion.precio_venta,
        tipo_pago: 'Contado',
        metodo_pago: req.body.metodo_pago || 'Efectivo',
        saldo_pendiente: 0,
        referencia: `CONTADO-${cotizacion._id.toString().slice(-6)}`
      }, { session });

      cotizacion.pago_contado_id = pagoContado._id;
      await cotizacion.save({ session });

    } else if (cotizacion.forma_pago === 'Financiado') {
      // Crear pago inicial (anticipo)
      const pagoInicial = await PaymentService.createInitialPayment(
        cotizacion, 
        req.body.metodo_pago,
        { session }
      );
      
      // Actualiza la cotización con el ID del pago inicial
      cotizacion.financiamiento.pagos = [pagoInicial._id];
      await cotizacion.save({ session });

      // Crear estado de cuenta
      await EstadoCuenta.create([{
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion._id,
        saldo_inicial: cotizacion.precio_venta,
        saldo_actual: cotizacion.precio_venta - cotizacion.financiamiento.anticipo_solicitado,
        pago_semanal: cotizacion.financiamiento.pago_semanal,
        fecha_vencimiento: cotizacion.financiamiento.fecha_termino,
        pagos_ids: [pagoInicial._id]
      }], { session });
    }

    await session.commitTransaction();
    
    // Obtener cotización completa con relaciones
    const cotizacionCreada = await obtenerCotizacionCompleta(cotizacion._id);

    res.status(201).json({
      success: true,
      message: 'Cotización creada exitosamente',
      data: {
        cotizacion: cotizacionCreada,
        [cotizacion.forma_pago === 'Contado' ? 'pago_contado' : 'pago_inicial']: {
          realizado: true,
          monto: cotizacion.forma_pago === 'Contado' 
            ? cotizacion.precio_venta 
            : cotizacion.financiamiento.anticipo_solicitado
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    handleError(res, error, 'Error al crear la cotización');
  } finally {
    session.endSession();
  }
};

const aprobarCotizacion = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }

    if (cotizacion.estado !== 'Pendiente') {
      return res.status(400).json({
        success: false,
        error: 'La cotización no está en estado Pendiente'
      });
    }

    cotizacion.estado = 'Aprobada';
    await cotizacion.save({ session });

    if (cotizacion.forma_pago === 'Financiado') {
      await PaymentService.generateScheduledPayments(cotizacion._id, { session });
    }

    await session.commitTransaction();
    
    res.json({ 
      success: true,
      data: await obtenerCotizacionCompleta(cotizacion._id)
    });
  } catch (error) {
    await session.abortTransaction();
    handleError(res, error, 'Error al aprobar cotización');
  } finally {
    session.endSession();
  }
};

const actualizarCotizacion = async (req, res) => {
  try {
    const cotizacionExistente = await Cotizacion.findById(req.params.id);
    
    if (!cotizacionExistente) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }

    if (cotizacionExistente.estado === 'Completada') {
      return res.status(400).json({ 
        success: false,
        error: 'No se puede modificar una cotización completada' 
      });
    }

    // No permitir cambiar forma_pago si ya hay pagos registrados
    if (req.body.forma_pago && req.body.forma_pago !== cotizacionExistente.forma_pago) {
      return res.status(400).json({
        success: false,
        error: 'No se puede cambiar la forma de pago una vez creada la cotización'
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
    
    res.json({ 
      success: true,
      data: cotizacion
    });
  } catch (error) {
    handleError(res, error, 'Error al actualizar cotización');
  }
};

const eliminarCotizacion = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }

    if (cotizacion.estado_servicio !== 'Pendiente') {
      return res.status(400).json({ 
        success: false,
        error: 'No se puede eliminar una cotización con servicios activos' 
      });
    }
    
    await Cotizacion.findByIdAndDelete(req.params.id, { session });
    await PaymentService.deletePaymentsByQuotation(cotizacion._id, { session });
    
    if (cotizacion.forma_pago === 'Financiado') {
      await EstadoCuenta.deleteOne({ cotizacion_id: cotizacion._id }, { session });
    }
    
    await session.commitTransaction();
    
    res.json({ 
      success: true,
      message: 'Cotización eliminada correctamente' 
    });
  } catch (error) {
    await session.abortTransaction();
    handleError(res, error, 'Error al eliminar cotización');
  } finally {
    session.endSession();
  }
};

// Operaciones de servicio
const activarServicio = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }
    
    if (cotizacion.estado !== 'Aprobada') {
      return res.status(400).json({ 
        success: false,
        error: 'La cotización debe estar aprobada para activar el servicio' 
      });
    }
    
    if (cotizacion.estado_servicio !== 'Pendiente') {
      return res.status(400).json({ 
        success: false,
        error: 'El servicio ya ha sido activado previamente' 
      });
    }
    
    cotizacion.estado_servicio = 'EnProceso';
    cotizacion.fecha_inicio_servicio = new Date();
    
    if (cotizacion.forma_pago === 'Financiado' && cotizacion.financiamiento) {
      cotizacion.financiamiento.fecha_inicio = new Date();
    }
    
    await cotizacion.save();
    
    res.json({ 
      success: true,
      data: await obtenerCotizacionCompleta(cotizacion._id)
    });
  } catch (error) {
    handleError(res, error, 'Error al activar servicio');
  }
};

const completarServicio = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }
    
    if (cotizacion.estado_servicio !== 'EnProceso') {
      return res.status(400).json({ 
        success: false,
        error: 'El servicio debe estar en proceso para completarlo' 
      });
    }
    
    if (cotizacion.forma_pago === 'Financiado' && 
        cotizacion.financiamiento.saldo_restante > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No se puede completar el servicio con saldo pendiente' 
      });
    }
    
    cotizacion.estado_servicio = 'Completado';
    cotizacion.estado = 'Completada';
    cotizacion.fecha_fin_servicio = new Date();
    
    await cotizacion.save();
    
    res.json({ 
      success: true,
      data: cotizacion
    });
  } catch (error) {
    handleError(res, error, 'Error al completar servicio');
  }
};

// Operaciones de pagos para servicios financiados
const registrarPago = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { monto, metodo_pago } = req.body;
    
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Monto de pago inválido' 
      });
    }

    const cotizacion = await Cotizacion.findById(req.params.id).session(session);
    
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }
    
    if (cotizacion.forma_pago !== 'Financiado') {
      return res.status(400).json({ 
        success: false,
        error: 'Solo se pueden registrar pagos para servicios financiados' 
      });
    }
    
    if (cotizacion.estado_servicio !== 'EnProceso') {
      return res.status(400).json({ 
        success: false,
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
    }, { session });
    
    // Actualizar saldo en la cotización
    cotizacion.financiamiento.saldo_restante -= monto;
    
    if (cotizacion.financiamiento.saldo_restante <= 0) {
      cotizacion.estado_servicio = 'Completado';
      cotizacion.fecha_fin_servicio = new Date();
    }
    
    await cotizacion.save({ session });
    
    // Actualizar estado de cuenta
    await EstadoCuenta.findOneAndUpdate(
      { cotizacion_id: cotizacion._id },
      { 
        $push: { pagos_ids: pago._id },
        $inc: { saldo_actual: -monto }
      },
      { session }
    );
    
    await session.commitTransaction();
    
    res.json({
      success: true,
      data: {
        cotizacion: await obtenerCotizacionCompleta(cotizacion._id),
        pago
      }
    });
  } catch (error) {
    await session.abortTransaction();
    handleError(res, error, 'Error al registrar pago');
  } finally {
    session.endSession();
  }
};

const obtenerHistorialPagos = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
    }

    const pagos = await PaymentService.getPaymentsByQuotation(req.params.id);
      
    res.json({
      success: true,
      data: {
        cotizacion: {
          _id: cotizacion._id,
          nombre_cotizacion: cotizacion.nombre_cotizacion,
          precio_venta: cotizacion.precio_venta,
          saldo_restante: cotizacion.financiamiento?.saldo_restante || 0
        },
        pagos
      }
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
    
    res.json({ 
      success: true,
      data: cotizaciones 
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener servicios por estado');
  }
};

const verificarCotizacion = async (req, res, next) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ 
        success: false,
        error: 'Cotización no encontrada' 
      });
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