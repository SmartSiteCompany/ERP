const express = require('express');
const productoServicioController = require('../controllers/productoServicioController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware.authenticateToken, productoServicioController.createProductoServicio);
router.get('/', authMiddleware.authenticateToken, productoServicioController.getProductosServicios);

module.exports = router;
