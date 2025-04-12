// src/routes/pagoRoutes.js
const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { validarMonto, validarDatosPago } = require('../middlewares/validarPago');

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos de contado y financiados
 */

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Obtiene todos los pagos con filtros avanzados
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: cotizacion_id
 *         schema:
 *           type: string
 *         description: ID de la cotización asociada
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: string
 *         description: ID del cliente
 *       - in: query
 *         name: tipo_pago
 *         schema:
 *           type: string
 *           enum: ['Contado', 'Financiado', 'Anticipo', 'Abono']
 *         description: Tipo de pago
 *       - in: query
 *         name: metodo_pago
 *         schema:
 *           type: string
 *           enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque']
 *         description: Método de pago
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *       500:
 *         description: Error del servidor
 */
router.get('/', pagoController.obtenerPagos);

/**
 * @swagger
 * /pagos/{id}:
 *   get:
 *     summary: Obtiene un pago específico o el pago de contado de una cotización
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago o de la cotización
 *     responses:
 *       200:
 *         description: Detalles del pago
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Pago'
 *                 - $ref: '#/components/schemas/Cotizacion'
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', pagoController.obtenerPago);

/**
 * @swagger
 * /pagos/financiados/{cotizacion_id}:
 *   get:
 *     summary: Obtiene los pagos pendientes de una cotización financiada
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: cotizacion_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización financiada
 *     responses:
 *       200:
 *         description: Lista de pagos pendientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *       500:
 *         description: Error del servidor
 */
router.get('/financiados/:cotizacion_id', pagoController.obtenerPagosFinanciados);

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registra un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagoInput'
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', validarDatosPago, validarMonto, pagoController.crearPago);

/**
 * @swagger
 * /pagos/{id}:
 *   put:
 *     summary: Actualiza un pago existente
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagoUpdate'
 *     responses:
 *       200:
 *         description: Pago actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', validarMonto, pagoController.actualizarPago);

/**
 * @swagger
 * /pagos/{id}:
 *   delete:
 *     summary: Elimina un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', pagoController.eliminarPago);

/**
 * @swagger
 * /pagos/debitar/{pago_id}:
 *   put:
 *     summary: Debita un pago financiado pendiente
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: pago_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago pendiente
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metodo_pago:
 *                 type: string
 *                 enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque']
 *                 default: 'Transferencia'
 *     responses:
 *       200:
 *         description: Pago debitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Pago no disponible para debitar
 *       500:
 *         description: Error del servidor
 */
router.put('/debitar/:pago_id', pagoController.debitarPagoFinanciado);

module.exports = router;