const express = require('express');
const detalleCotizacionController = require('../controllers/detalleCotizacionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware.authenticateToken, detalleCotizacionController.createDetalleCotizacion);
router.get('/', authMiddleware.authenticateToken, detalleCotizacionController.getDetallesCotizacion);

module.exports = router;
