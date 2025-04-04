const Cotizacion = require('../models/Cotizacion');

// Obtener todas las cotizaciones
const obtenerCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.find().populate('cliente_id', 'filial_id');
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener una cotización por ID
const obtenerCotizacionPorId = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id).populate('cliente_id', 'filial_id');
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Crear una nueva cotización
const crearCotizacion = async (req, res) => {
  const cotizacion = new Cotizacion(req.body);
  try {
    await cotizacion.save();
    res.status(201).json(cotizacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Actualizar una cotización
const actualizarCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(cotizacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar una cotización
const eliminarCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findByIdAndDelete(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json({ message: 'Cotización eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerCotizaciones,
  obtenerCotizacionPorId,
  crearCotizacion,
  actualizarCotizacion,
  eliminarCotizacion,
};