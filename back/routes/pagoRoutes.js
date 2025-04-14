// src/routes/pagoRoutes.js
const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { validarMonto, validarDatosPago } = require('../middlewares/validarPago');

router.get('/', pagoController.obtenerPagos);
router.get('/:id', pagoController.obtenerPago);
router.get('/financiados/:cotizacion_id', pagoController.obtenerPagosFinanciados);
router.post('/', validarDatosPago, validarMonto, pagoController.crearPago);
router.put('/:id', validarMonto, pagoController.actualizarPago);
router.delete('/:id', pagoController.eliminarPago);
router.put('/debitar/:pago_id', pagoController.debitarPagoFinanciado);

module.exports = router;