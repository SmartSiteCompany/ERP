// src/controllers/cotizacionController.js
const Cotizacion = require('../models/Cotizacion');
const Pago = require('../models/Pago');

// Operaciones CRUD básicas para cotizaciones
const obtenerCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.find()
      .populate('cliente')
      .populate('filial', 'nombre');
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerCotizacionPorId = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id)
      .populate('cliente')
      .populate('filial', 'nombre');
      
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
    const cotizacion = new Cotizacion(req.body);
    await cotizacion.save();
    res.status(201).json(cotizacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const actualizarCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
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
    const cotizacion = await Cotizacion.findByIdAndDelete(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    // Opcional: Eliminar pagos asociados si existen
    await Pago.deleteMany({ cotizacion_id: cotizacion._id });
    
    res.json({ message: 'Cotización eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Operaciones de servicio financiado
const activarServicio = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    if (cotizacion.estado !== 'Aprobada') {
      return res.status(400).json({ error: 'La cotización debe estar aprobada para activar el servicio' });
    }
    
    if (cotizacion.estadoServicio !== 'Pendiente') {
      return res.status(400).json({ error: 'El servicio ya ha sido activado previamente' });
    }
    
    // Actualizar para activar el servicio
    cotizacion.estadoServicio = 'Activo';
    cotizacion.fechaInicioServicio = new Date();
    
    await cotizacion.save();
    res.json(cotizacion);
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
    
    if (cotizacion.estadoServicio !== 'Activo') {
      return res.status(400).json({ error: 'El servicio no está activo' });
    }
    
    cotizacion.estadoServicio = 'Completado';
    cotizacion.fechaFinServicio = new Date();
    
    await cotizacion.save();
    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Operaciones de pagos para servicios financiados
const registrarPago = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    if (cotizacion.tipo !== 'Financiado') {
      return res.status(400).json({ error: 'Solo se pueden registrar pagos para servicios financiados' });
    }
    
    if (cotizacion.estadoServicio !== 'Activo') {
      return res.status(400).json({ error: 'El servicio no está activo' });
    }
    
    const { monto } = req.body;
    
    // Crear registro de pago
    const pago = new Pago({
      cotizacion_id: cotizacion._id,
      cliente_id: cotizacion.cliente,
      monto,
      fecha: new Date()
    });
    
    await pago.save();
    
    // Actualizar saldo en la cotización
    cotizacion.financiamiento.saldoRestante -= monto;
    
    // Verificar si el servicio ha sido liquidado
    if (cotizacion.financiamiento.saldoRestante <= 0) {
      cotizacion.estadoServicio = 'Completado';
      cotizacion.fechaFinServicio = new Date();
    }
    
    await cotizacion.save();
    
    res.json({
      cotizacion,
      pago
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerHistorialPagos = async (req, res) => {
  try {
    const pagos = await Pago.find({ cotizacion_id: req.params.id })
      .sort({ fecha: -1 });
      
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener servicios por estado
const obtenerServiciosPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const cotizaciones = await Cotizacion.find({ 
      estadoServicio: estado,
      tipo: 'Financiado' // Solo servicios financiados
    })
    .populate('cliente')
    .populate('filial', 'nombre');
    
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Operaciones CRUD básicas
  obtenerCotizaciones,
  obtenerCotizacionPorId,
  crearCotizacion,
  actualizarCotizacion,
  eliminarCotizacion,
  
  // Operaciones de servicio
  activarServicio,
  completarServicio,
  
  // Operaciones de pagos
  registrarPago,
  obtenerHistorialPagos,
  
  // Consultas especializadas
  obtenerServiciosPorEstado
};