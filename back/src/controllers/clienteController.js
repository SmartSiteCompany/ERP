const Cliente = require('../models/Cliente');

// Crear un nuevo cliente (ya lo tienes)
exports.createCliente = async (req, res) => {
  try {
    const { nombre_cliente, direccion_cliente, ciudad_estado_cliente, telefono_cliente, email_cliente, tier_cliente } = req.body;
    const nuevoCliente = new Cliente({ nombre_cliente, direccion_cliente, ciudad_estado_cliente, telefono_cliente, email_cliente, tier_cliente: tier_cliente || 4 });
    await nuevoCliente.save();
    res.status(201).json({ message: 'Cliente creado exitosamente', cliente: nuevoCliente });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente', details: error.message });
  }
};

// Obtener todos los clientes (ya lo tienes)
exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', details: error.message });
  }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteActualizado = await Cliente.findByIdAndUpdate(id, req.body, { new: true });
    if (!clienteActualizado) return res.status(404).json({ error: 'Cliente no encontrado' });

    res.json({ message: 'Cliente actualizado exitosamente', cliente: clienteActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente', details: error.message });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteEliminado = await Cliente.findByIdAndDelete(id);
    if (!clienteEliminado) return res.status(404).json({ error: 'Cliente no encontrado' });

    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente', details: error.message });
  }
};
