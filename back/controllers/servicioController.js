const ServicioFinanciado = require('../models/ServicioFinanciado');
const Cotizacion = require('../models/Cotizacion');
const Pago = require('../models/Pago');

// Obtener todos los servicios financiados (con filtro por cliente opcional)
const obtenerServiciosFinanciados = async (req, res) => {
  try {
    const { cliente_id } = req.query;
    const query = cliente_id ? { cliente_id } : {};
    
    const servicios = await ServicioFinanciado.find(query)
      .populate('cliente_id')
      .populate('cotizacion_id'); // Ahora también popula la cotización
    
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener un servicio financiado por ID
const obtenerServicioFinanciadoPorId = async (req, res) => {
  try {
    const servicio = await ServicioFinanciado.findById(req.params.id).populate('cliente_id');
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Crear un nuevo servicio financiado
const crearServicioFinanciado = async (req, res) => {
  const servicio = new ServicioFinanciado(req.body);
  try {
    await servicio.save();
    res.status(201).json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Actualizar un servicio financiado
const actualizarServicioFinanciado = async (req, res) => {
  try {
    const servicio = await ServicioFinanciado.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar un servicio financiado
const eliminarServicioFinanciado = async (req, res) => {
  try {
    const servicio = await ServicioFinanciado.findByIdAndDelete(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Función auxiliar para calcular semanas (debes implementarla según tu lógica de negocio)
function calcularSemanas(cotizacion) {
  // Ejemplo básico: podrías tener un campo 'plazo_semanas' en la cotización
  return cotizacion.plazo_semanas || 52; // Valor por defecto: 1 año (52 semanas)
}

// Controlador para convertir cotización a servicio financiado
const crearServicioDesdeCotizacion = async (req, res) => {
  try {
    const { cotizacionId } = req.body;

    const cotizacion = await Cotizacion.findById(cotizacionId);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Validar que sea financiado
    if (cotizacion.forma_pago !== 'Financiado') {
      return res.status(400).json({ error: 'Solo cotizaciones financiadas pueden convertirse en servicios' });
    }

    // Validar que no exista ya un servicio para esta cotización
    const servicioExistente = await ServicioFinanciado.findOne({ cotizacion_id: cotizacionId });
    if (servicioExistente) {
      return res.status(400).json({ error: 'Ya existe un servicio creado para esta cotización' });
    }

    // Calcular valores del servicio
    const montoFinanciado = cotizacion.precio_venta - (cotizacion.anticipo_solicitado || 0);
    const semanas = calcularSemanas(cotizacion);

    const servicio = new ServicioFinanciado({
      cotizacion_id: cotizacion._id,
      cliente_id: cotizacion.cliente_id,
      monto_servicio: cotizacion.precio_venta,
      pago_semanal: montoFinanciado / semanas,
      saldo_restante: montoFinanciado,
      estado: 'Activo', // Campo adicional recomendado
      fecha_inicio: new Date(), // Campo adicional recomendado
      // ... otros campos que necesites
    });

    await servicio.save();
    res.status(201).json(servicio);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Obtener servicio por ID de cotización
 */
const obtenerServicioPorCotizacionId = async (req, res) => {
  try {
    const servicio = await ServicioFinanciado.findOne({ 
      cotizacion_id: req.params.cotizacionId 
    }).populate('cliente_id').populate('cotizacion_id');
    
    if (!servicio) {
      return res.status(404).json({ error: 'No se encontró servicio para esta cotización' });
    }
    
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * @desc    Obtener pagos por ID de servicio
 * @route   GET /api/servicios/:id/pagos
 * @access  Privado
 */
const obtenerHistorialPagos = async (req, res) => {
  try {
    const pagos = await Pago.find({ servicio_id: req.params.id })
      .populate('cliente_id', 'nombre email') // Ajusta los campos según tu modelo Cliente
      .sort({ fecha_pago: -1 }); // Ordenar por fecha descendente

    if (!pagos || pagos.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron pagos para este servicio' });
    }

    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * @desc    Registrar un pago y actualizar saldos
 * @route   POST /api/servicios/:id/registrar-pago
 * @access  Privado
 */
const registrarPago = async (req, res) => {
  try {
    const { monto_pago, nuevo_pago_semanal } = req.body;
    const servicio = await ServicioFinanciado.findById(req.params.id);
    
    if (!servicio) {
      return res.status(404).json({ msg: 'Servicio no encontrado' });
    }

    // Validar que el pago no exceda el saldo
    if (monto_pago > servicio.saldo_restante) {
      return res.status(400).json({ 
        msg: `El monto excede el saldo restante ($${servicio.saldo_restante})` 
      });
    }

    // Calcular nuevo saldo
    const nuevo_saldo = servicio.saldo_restante - monto_pago;

    // Crear el registro de pago
    const nuevoPago = new Pago({
      cliente_id: servicio.cliente_id,
      servicio_id: servicio._id,
      monto_pago,
      saldo_pendiente: nuevo_saldo,
      nuevo_pago_semanal: nuevo_pago_semanal || servicio.pago_semanal
    });

    await nuevoPago.save();

    // Actualizar el servicio
    servicio.saldo_restante = nuevo_saldo;
    
    // Actualizar pago semanal si se especificó
    if (nuevo_pago_semanal) {
      servicio.pago_semanal = nuevo_pago_semanal;
    }

    // Cambiar estado si se liquida
    if (nuevo_saldo <= 0) {
      servicio.estado = 'Liquidado';
      servicio.fecha_liquidacion = new Date();
    }

    await servicio.save();

    res.json({
      servicio,
      pago: nuevoPago,
      msg: 'Pago registrado exitosamente'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerServiciosFinanciados,
  obtenerServicioFinanciadoPorId,
  crearServicioFinanciado,
  actualizarServicioFinanciado,
  eliminarServicioFinanciado,
  crearServicioDesdeCotizacion,
  actualizarServicioFinanciado,
  eliminarServicioFinanciado,
  obtenerServicioPorCotizacionId,
  obtenerHistorialPagos,
  registrarPago,
  obtenerHistorialPagos,
  registrarPago
};