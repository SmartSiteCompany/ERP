const Cotizacion = require('../models/Cotizaciones');

exports.createCotizacion = async (req, res) => {
  try {
    const nuevaCotizacion = new Cotizacion(req.body);
    await nuevaCotizacion.save();
    res.status(201).json({ message: 'Cotización creada exitosamente', cotizacion: nuevaCotizacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cotización', details: error.message });
  }
};

exports.getCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.find().populate('cliente');
    res.status(200).json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cotizaciones', details: error.message });
  }
};
