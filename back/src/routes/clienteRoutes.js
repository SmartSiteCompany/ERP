const express = require('express');
const clienteController = require('../controllers/clienteController');
const router = express.Router();

// Crear cliente
router.post('/', clienteController.createCliente);

// Obtener todos los clientes
router.get('/', clienteController.getClientes);

// Actualizar cliente
router.put('/:id', clienteController.updateCliente);

// Eliminar cliente
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;
