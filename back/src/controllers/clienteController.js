// src/controllers/clienteController.js
const Cliente = require('../models/Cliente');

// Crear un nuevo cliente
exports.createClientes = async (req, res) => {
  const { nombre_cliente, direccion_cliente, ciudad_estado_cliente, telefono_cliente, email_cliente, tier_cliente } = req.body;

  // Validaciones previas
  if (!nombre_cliente || !email_cliente) {
    return res.status(400).json({ error: 'El nombre y el correo son obligatorios.' });
  }

  try {
    // Validar duplicados
    const clienteExistente = await Cliente.findOne({ email_cliente });
    if (clienteExistente) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // Crear cliente
    const nuevoCliente = new Cliente({ 
      nombre_cliente, 
      direccion_cliente, 
      ciudad_estado_cliente, 
      telefono_cliente, 
      email_cliente, 
      tier_cliente: tier_cliente || 4 
    });
    await nuevoCliente.save();

    res.status(201).json({ message: 'Cliente creado exitosamente', cliente: nuevoCliente });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente', details: error.message });
  }
};


// Obtener todos los clientes 
exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    console.log("Clientes obtenidos desde la base de datos:", clientes); // 👀 Log de depuración
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: 'Error al obtener clientes', details: error.message });
  }
};

// Actualizar un cliente
exports.updateClientes = async (req, res) => {
  const { id } = req.params;

  try {
    const clienteExistente = await Cliente.findById(id);
    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    const clienteActualizado = await Cliente.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Cliente actualizado exitosamente', cliente: clienteActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente', details: error.message });
  }
};


// Eliminar un cliente
exports.deleteClientes = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteEliminado = await Cliente.findByIdAndDelete(id);
    if (!clienteEliminado) return res.status(404).json({ error: 'Cliente no encontrado' });

    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente', details: error.message });
  }
};
