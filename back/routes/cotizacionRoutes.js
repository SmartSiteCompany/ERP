// src/routes/cotizacionRoutes.js
const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');
const pdfController = require('../controllers/pdfController');
const { validatePaymentMethod } = require('../middlewares/paymentValidation');

router.get('/', cotizacionController.obtenerCotizaciones);
router.get('/:id', cotizacionController.obtenerCotizacionPorId);
router.post('/', cotizacionController.crearCotizacion);
// Ruta para crear cotizaciones
router.post(
    '/cotizaciones', 
    validatePaymentMethod, // Nuevo middleware
    cotizacionController.crearCotizacion
  );
router.put('/:id', cotizacionController.actualizarCotizacion);
router.delete('/:id', cotizacionController.eliminarCotizacion);
// ==============================================
// Operaciones de Servicios
// ==============================================
router.post('/:id/activar', cotizacionController.activarServicio);
router.post('/:id/completar', cotizacionController.completarServicio);
router.get('/servicios/:estado', cotizacionController.obtenerServiciosPorEstado);
// ==============================================
// Operaciones de Pagos (para servicios financiados)
// ==============================================
router.post('/:id/pagos', cotizacionController.registrarPago);
router.get('/:id/pagos', cotizacionController.obtenerHistorialPagos);
// Generador de PDFs
router.get('/:id/pdf', cotizacionController.verificarCotizacion, pdfController.generarPDFCotizacion);
module.exports = router;