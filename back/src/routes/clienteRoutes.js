const express = require('express');
const {
  createClientes,
  getClientes,
  updateClientes,
  deleteClientes,
} = require('../controllers/clienteController');

const router = express.Router();

router.post('/clientes', createClientes); // Crear cliente
router.get('/clientes', getClientes); // Obtener clientes
router.put('/clientes/:id', updateClientes); // Actualizar cliente
router.delete('/clientes/:id', deleteClientes); // Eliminar cliente

module.exports = router;
