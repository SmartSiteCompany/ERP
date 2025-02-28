// src/routes/estadoCuentaRoutes.js
const express = require('express');
const estadoCuentaController = require('../controllers/estadoCuentaController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware.authenticateToken, estadoCuentaController.createOrUpdateEstadoCuenta);
router.get('/', authMiddleware.authenticateToken, estadoCuentaController.getEstadosCuenta);

module.exports = router;
