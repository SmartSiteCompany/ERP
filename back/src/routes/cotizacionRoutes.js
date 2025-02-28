const express = require('express');
const cotizacionController = require('../controllers/cotizacionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware.authenticateToken, cotizacionController.createCotizacion);
router.get('/', authMiddleware.authenticateToken, cotizacionController.getCotizaciones);

module.exports = router;
