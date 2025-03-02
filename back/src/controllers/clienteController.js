// src/controllers/clienteController.js
const Cliente = require('../models/Cliente');

exports.createCliente = async (req, res) => {
  try {
    const { nombre_cliente, direccion_cliente, ciudad_estado_cliente, telefono_cliente, email_cliente, tier_cliente } = req.body;

    const nuevoCliente = new Cliente({
      nombre_cliente,
      direccion_cliente,
      ciudad_estado_cliente,
      telefono_cliente,
      email_cliente,
      tier_cliente: tier_cliente || 4  // Si no se especifica, será Tier 4
    });

    await nuevoCliente.save();
    res.status(201).json({ message: 'Cliente creado exitosamente', cliente: nuevoCliente });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente', details: error.message });
  }
};


exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', details: error.message });
  }
};
