// src/routes/estadoCuentaRoutes.js
const express = require('express');
const router = express.Router();
const estadoCuentaController = require('../controllers/estadoCuentaController');

router.get('/', estadoCuentaController.obtenerEstadosCuenta);
router.get('/:id', estadoCuentaController.obtenerEstadoCuentaPorId);
router.post('/', estadoCuentaController.crearEstadoCuenta);
router.put('/:id', estadoCuentaController.actualizarEstadoCuenta);
router.delete('/:id', estadoCuentaController.eliminarEstadoCuenta);

module.exports = router;