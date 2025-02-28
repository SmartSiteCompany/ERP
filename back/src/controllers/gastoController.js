const Gasto = require('../models/Gastos');

exports.createGasto = async (req, res) => {
  try {
    const nuevoGasto = new Gasto(req.body);
    await nuevoGasto.save();
    res.status(201).json({ message: 'Gasto registrado exitosamente', gasto: nuevoGasto });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar gasto', details: error.message });
  }
};

exports.getGastos = async (req, res) => {
  try {
    const gastos = await Gasto.find();
    res.status(200).json(gastos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos', details: error.message });
  }
};
