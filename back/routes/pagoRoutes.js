const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Middlewares
const { validateCreatePayment } = pagoController;
const { verificarCotizacion } = require('../controllers/cotizacionController');

// ==============================================
// Rutas CRUD para Pagos
// ==============================================

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Obtener todos los pagos con filtros
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: cotizacion_id
 *         schema: { type: string }
 *       - in: query
 *         name: cliente_id
 *         schema: { type: string }
 *       - in: query
 *         name: tipo_pago
 *         schema: { type: string, enum: [Contado, Anticipo, Abono, Intereses] }
 *     responses:
 *       200: 
 *         description: Lista de pagos
 */
router.get('/', pagoController.obtenerPagos);

/**
 * @swagger
 * /api/pagos/:id:
 *   get:
 *     summary: Obtener un pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalles del pago
 *       404:
 *         description: Pago no encontrado
 */
router.get('/:id', pagoController.obtenerPagoPorId);

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Registrar un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', validateCreatePayment, pagoController.registrarPago);

/**
 * @swagger
 * /api/pagos/:id:
 *   put:
 *     summary: Actualizar un pago existente
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       200:
 *         description: Pago actualizado
 *       400:
 *         description: No se puede modificar pagos de contado
 */
router.put('/:id', pagoController.actualizarPago);

/**
 * @swagger
 * /api/pagos/:id:
 *   delete:
 *     summary: Eliminar un pago (excepto de contado)
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pago eliminado
 *       400:
 *         description: No se puede eliminar pagos de contado
 */
router.delete('/:id', pagoController.eliminarPago);

// ==============================================
// Rutas Específicas para Financiamiento
// ==============================================

/**
 * @swagger
 * /api/pagos/cotizacion/:cotizacion_id:
 *   get:
 *     summary: Obtener pagos por cotización
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: cotizacion_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de pagos asociados
 */
router.get('/cotizacion/:cotizacion_id', verificarCotizacion, pagoController.obtenerPagosPorCotizacion);

module.exports = router;