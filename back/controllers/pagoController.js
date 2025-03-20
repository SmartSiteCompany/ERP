const Pago = require('../models/Pago'); 

// Obtener todos los pagos
const obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.find().populate('cliente_id servicio_id');
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener un pago por ID
const obtenerPagoPorId = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id).populate('cliente_id servicio_id');
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Crear un nuevo pago
const crearPago = async (req, res) => {
  const pago = new Pago(req.body);
  try {
    await pago.save();
    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Actualizar un pago
const actualizarPago = async (req, res) => {
  try {
    const pago = await Pago.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar un pago
const eliminarPago = async (req, res) => {
  try {
    const pago = await Pago.findByIdAndDelete(req.params.id);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerPagos,
  obtenerPagoPorId,
  crearPago,
  actualizarPago,
  eliminarPago
};  