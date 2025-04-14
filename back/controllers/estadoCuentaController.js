// src/controllers/estadoCuentaController.js
const EstadoCuenta = require('../models/EstadoCuenta'); 
const Pago = require('../models/Pago');
const Cotizacion = require('../models/Cotizacion');

/**
 * Obtiene todos los estados de cuenta con pagos relacionados
 */
const obtenerEstadosCuenta = async (req, res) => {
  try {
    const estados = await EstadoCuenta.find()
      .populate('cliente_id', 'nombre email')
      .populate('cotizacion_id', 'nombre_cotizacion precio_venta')
      .populate('pagos_ids', 'monto_pago fecha_pago metodo_pago');
    
    res.json(estados);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener estados de cuenta',
      details: error.message 
    });
  }
};

/**
 * Obtiene un estado de cuenta específico con detalles completos
 */
const obtenerEstadoCuentaPorId = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findById(req.params.id)
      .populate('cliente_id', 'nombre email telefono direccion')
      .populate({
        path: 'cotizacion_id',
        select: 'nombre_cotizacion precio_venta forma_pago',
        populate: {
          path: 'filial_id',
          select: 'nombre_filial'
        }
      })
      .populate('pagos_ids', 'monto_pago fecha_pago tipo_pago metodo_pago estado');
    
    if (!estado) {
      return res.status(404).json({ 
        error: 'Estado de cuenta no encontrado' 
      });
    }
    
    res.json(estado);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener el estado de cuenta',
      details: error.message 
    });
  }
};

/**
 * Obtiene el estado de cuenta asociado a una cotización específica
 */
const obtenerEstadoPorCotizacion = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findOne({ 
      cotizacion_id: req.params.cotizacion_id 
    })
    .populate({
      path: 'pagos_ids',
      options: { sort: { fecha_pago: -1 } }
    });
    
    if (!estado) {
      return res.status(404).json({
        error: 'No se encontró estado de cuenta para esta cotización'
      });
    }
    
    res.json(estado);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener estado por cotización',
      details: error.message 
    });
  }
};

/**
 * Calcula intereses moratorios para estados vencidos
 */
const calcularIntereses = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findById(req.params.id);
    
    if (!estado) {
      return res.status(404).json({ error: 'Estado de cuenta no encontrado' });
    }
    
    if (estado.fecha_vencimiento < new Date() && estado.estado !== 'Pagado') {
      const diasMora = Math.floor(
        (new Date() - estado.fecha_vencimiento) / (1000 * 60 * 60 * 24)
      );
      
      estado.intereses_moratorios = diasMora * (estado.saldo_actual * 0.01); // 1% diario
      estado.saldo_actual += estado.intereses_moratorios;
      
      await estado.save();
    }
    
    res.json(estado);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al calcular intereses',
      details: error.message 
    });
  }
};

/**
 * Crea un nuevo estado de cuenta (usado automáticamente al crear cotizaciones financiadas)
 */
const crearEstadoCuenta = async (req, res) => {
  try {
    // Validación básica
    if (!req.body.cotizacion_id || !req.body.cliente_id) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'cotizacion_id y cliente_id son requeridos'
      });
    }
    
    const estado = new EstadoCuenta(req.body);
    await estado.save();
    
    res.status(201).json(estado);
  } catch (error) {
    res.status(400).json({ 
      error: 'Error al crear estado de cuenta',
      details: error.message,
      validationErrors: error.errors 
    });
  }
};

/**
 * Actualiza un estado de cuenta existente
 */
const actualizarEstadoCuenta = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true 
      }
    );
    
    if (!estado) {
      return res.status(404).json({ error: 'Estado de cuenta no encontrado' });
    }
    
    res.json(estado);
  } catch (error) {
    res.status(400).json({ 
      error: 'Error al actualizar estado de cuenta',
      details: error.message 
    });
  }
};

/**
 * Elimina un estado de cuenta (solo si no tiene pagos asociados)
 */
const eliminarEstadoCuenta = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findById(req.params.id);
    
    if (!estado) {
      return res.status(404).json({ error: 'Estado de cuenta no encontrado' });
    }
    
    // Verificar si tiene pagos asociados
    const pagosAsociados = await Pago.countDocuments({ 
      _id: { $in: estado.pagos_ids } 
    });
    
    if (pagosAsociados > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar un estado de cuenta con pagos registrados'
      });
    }
    
    await EstadoCuenta.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Estado de cuenta eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar estado de cuenta',
      details: error.message 
    });
  }
};

module.exports = {
  obtenerEstadosCuenta,
  obtenerEstadoCuentaPorId,
  obtenerEstadoPorCotizacion,
  calcularIntereses,
  crearEstadoCuenta,
  actualizarEstadoCuenta,
  eliminarEstadoCuenta
};