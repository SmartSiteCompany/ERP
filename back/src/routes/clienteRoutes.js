// src/routes/clienteRoutes.js
const express = require('express');
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

//router.post('/', authMiddleware.authenticateToken, clienteController.createCliente);
//router.get('/', authMiddleware.authenticateToken, clienteController.getClientes);

router.post('/', clienteController.createCliente);
router.get('/', clienteController.getClientes);


module.exports = router;