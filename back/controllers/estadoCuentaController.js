const EstadoCuenta = require('../models/EstadoCuenta'); 

// Obtener todos los estados de cuenta
const obtenerEstadosCuenta = async (req, res) => {
  try {
    const estados = await EstadoCuenta.find().populate('cliente_id servicio_id');
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener un estado de cuenta por ID
const obtenerEstadoCuentaPorId = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findById(req.params.id).populate('cliente_id servicio_id');
    if (!estado) {
      return res.status(404).json({ error: 'Estado de cuenta no encontrado' });
    }
    res.json(estado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener estado de cuenta por cotización
const obtenerEstadoPorCotizacion = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findOne({ 
      cotizacion_id: req.params.cotizacion_id 
    }).populate('pagos_ids');
    res.json(estado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calcular intereses moratorios
const calcularIntereses = async (req, res) => {
  const estado = await EstadoCuenta.findById(req.params.id);
  if (estado.fecha_vencimiento < new Date() && estado.estado !== 'Pagado') {
    const diasMora = Math.floor((new Date() - estado.fecha_vencimiento) / (1000 * 60 * 60 * 24));
    estado.intereses_moratorios = diasMora * (estado.saldo_actual * 0.01); // Ej: 1% diario
    await estado.save();
  }
  res.json(estado);
};

// Crear un nuevo estado de cuenta
const crearEstadoCuenta = async (req, res) => {
  const estado = new EstadoCuenta(req.body);
  try {
    await estado.save();
    res.status(201).json(estado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Actualizar un estado de cuenta
const actualizarEstadoCuenta = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!estado) {
      return res.status(404).json({ error: 'Estado de cuenta no encontrado' });
    }
    res.json(estado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar un estado de cuenta
const eliminarEstadoCuenta = async (req, res) => {
  try {
    const estado = await EstadoCuenta.findByIdAndDelete(req.params.id);
    if (!estado) {
      return res.status(404).json({ error: 'Estado de cuenta no encontrado' });
    }
    res.json({ message: 'Estado de cuenta eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerEstadosCuenta,
  obtenerEstadoCuentaPorId,
  obtenerEstadoPorCotizacion,
  calcularIntereses,
  crearEstadoCuenta,
  actualizarEstadoCuenta,
  eliminarEstadoCuenta,
};