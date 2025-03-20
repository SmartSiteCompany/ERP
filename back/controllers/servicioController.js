const ServicioFinanciado = require('../models/ServicioFinanciado');

// Obtener todos los servicios financiados
const obtenerServiciosFinanciados = async (req, res) => {
  try {
    const servicios = await ServicioFinanciado.find().populate('cliente_id');
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

module.exports = {
  obtenerServiciosFinanciados,
  obtenerServicioFinanciadoPorId,
  crearServicioFinanciado,
  actualizarServicioFinanciado,
  eliminarServicioFinanciado,
};