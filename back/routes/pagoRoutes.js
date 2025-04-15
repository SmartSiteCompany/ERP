// src/routes/pagoRoutes.js
const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { validarMonto, validarDatosPago } = require('../middlewares/validarPago');

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos de clientes (contado/financiado)
 */
/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo_pago
 *         schema:
 *           type: string
 *           enum: [Contado, Financiado, Anticipo, Abono]
 *         description: Filtrar por tipo de pago
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         example: "2023-01-01"
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 */
router.get('/', pagoController.obtenerPagos);

/**
 * @swagger
 * /api/pagos/{id}:
 *   get:
 *     summary: Obtener un pago específico
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "611f1f77bcf86cd799433355"
 *     responses:
 *       200:
 *         description: Detalles del pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado
 */
router.get('/:id', pagoController.obtenerPago);

/**
 * @swagger
 * /api/pagos/financiados/{cotizacion_id}:
 *   get:
 *     summary: Obtener pagos de una cotización financiada
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: cotizacion_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pagos asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *       400:
 *         description: ID de cotización inválido
 */
router.get('/financiados/:cotizacion_id', pagoController.obtenerPagosFinanciados);

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Registrar nuevo pago
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Error de validación (monto inválido o datos incompletos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 */
router.post('/', validarDatosPago, validarMonto, pagoController.crearPago);

/** 
* @swagger
* /api/pagos/{id}:
*   put:
*     summary: Actualizar pago existente
*     tags: [Pagos]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Pago'
*     responses:
*       200:
*         description: Pago actualizado
*       404:
*         description: Pago no encontrado
*/
router.put('/:id', validarMonto, pagoController.actualizarPago);

/**
 * @swagger
 * /api/pagos/{id}:
 *   delete:
 *     summary: Eliminar un pago
 *     tags: [Pagos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Pago eliminado correctamente"
 *       403:
 *         description: No autorizado (solo administradores)
 */
router.delete('/:id', pagoController.eliminarPago);

/**
 * @swagger
 * /api/pagos/debitar/{pago_id}:
 *   put:
 *     summary: Debitar pago financiado (cobro automático)
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: pago_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Débito realizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nuevo_saldo:
 *                   type: number
 *                   example: 1500
 *                 comprobante:
 *                   $ref: '#/components/schemas/Documento'
 *       402:
 *         description: Fondos insuficientes
 */
router.put('/debitar/:pago_id', pagoController.debitarPagoFinanciado);

module.exports = router;