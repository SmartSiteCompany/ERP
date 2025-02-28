const ProductoServicio = require('../models/ProductoServicio');

exports.createProductoServicio = async (req, res) => {
  try {
    const nuevoProducto = new ProductoServicio(req.body);
    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto/Servicio agregado', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto/servicio', details: error.message });
  }
};

exports.getProductosServicios = async (req, res) => {
  try {
    const productos = await ProductoServicio.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos/servicios', details: error.message });
  }
};
