const DetalleCotizacion = require('../models/DetalleCotizaciones');

exports.createDetalleCotizacion = async (req, res) => {
  try {
    const nuevoDetalle = new DetalleCotizacion(req.body);
    await nuevoDetalle.save();
    res.status(201).json({ message: 'Detalle de cotización agregado', detalle: nuevoDetalle });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar detalle de cotización', details: error.message });
  }
};

exports.getDetallesCotizacion = async (req, res) => {
  try {
    const detalles = await DetalleCotizacion.find();
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalles', details: error.message });
  }
};
