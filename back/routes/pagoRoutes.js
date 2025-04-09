const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Endpoints para gestionar pagos de contado y financiados
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pago:
 *       type: object
 *       required:
 *         - cotizacion_id
 *         - cliente_id
 *         - monto_pago
 *         - metodo_pago
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del pago
 *         cotizacion_id:
 *           type: string
 *           description: Referencia a la cotización asociada
 *         cliente_id:
 *           type: string
 *           description: Referencia al cliente
 *         fecha_pago:
 *           type: string
 *           format: date-time
 *           description: Fecha del pago (automática)
 *         monto_pago:
 *           type: number
 *           minimum: 0.01
 *           description: Monto del pago
 *         saldo_pendiente:
 *           type: number
 *           description: Saldo restante después del pago
 *         tipo_pago:
 *           type: string
 *           enum: [Contado, Financiado, Anticipo, Abono]
 *           description: Tipo de pago
 *         metodo_pago:
 *           type: string
 *           enum: [Efectivo, Transferencia, Tarjeta, Cheque]
 *           description: Método de pago utilizado
 *         referencia:
 *           type: string
 *           description: Referencia/folio del pago
 *         observaciones:
 *           type: string
 *           description: Notas adicionales
 */

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Obtener todos los pagos con filtros
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: cotizacion_id
 *         schema:
 *           type: string
 *         description: Filtrar por ID de cotización
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: string
 *         description: Filtrar por ID de cliente
 *       - in: query
 *         name: tipo_pago
 *         schema:
 *           type: string
 *           enum: [Contado, Financiado, Anticipo, Abono]
 *         description: Filtrar por tipo de pago
 *       - in: query
 *         name: metodo_pago
 *         schema:
 *           type: string
 *           enum: [Efectivo, Transferencia, Tarjeta, Cheque]
 *         description: Filtrar por método de pago
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial para filtrar
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final para filtrar
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
 *     summary: Obtener un pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', pagoController.obtenerPagoPorId);

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *           example:
 *             cotizacion_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *             monto_pago: 1500
 *             tipo_pago: "Abono"
 *             metodo_pago: "Transferencia"
 *             referencia: "TRANS-123456"
 *             observaciones: "Pago correspondiente a la semana 1"
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *         examples:
 *           financiado:
 *             value:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0l"
 *               cotizacion_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               fecha_pago: "2023-10-15T12:00:00Z"
 *               monto_pago: 1500
 *               saldo_pendiente: 3500
 *               tipo_pago: "Abono"
 *               metodo_pago: "Transferencia"
 *           contado:
 *             value:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0m"
 *               cotizacion_id: "64f1a2b3c4d5e6f7g8h9i0n"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               fecha_pago: "2023-10-15T12:00:00Z"
 *               monto_pago: 5000
 *               saldo_pendiente: 0
 *               tipo_pago: "Contado"
 *               metodo_pago: "Efectivo"
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cotización no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/', pagoController.crearPago);

/**
 * @swagger
 * /pagos/{id}:
 *   put:
 *     summary: Actualizar un pago existente
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
 *             type: object
 *             properties:
 *               monto_pago:
 *                 type: number
 *                 minimum: 0.01
 *               metodo_pago:
 *                 type: string
 *                 enum: [Efectivo, Transferencia, Tarjeta, Cheque]
 *               referencia:
 *                 type: string
 *               observaciones:
 *                 type: string
 *           example:
 *             monto_pago: 1600
 *             metodo_pago: "Tarjeta"
 *             referencia: "TARJ-789456"
 *             observaciones: "Actualización del monto"
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Datos inválidos o no permitidos
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', pagoController.actualizarPago);

/**
 * @swagger
 * /pagos/{id}:
 *   delete:
 *     summary: Eliminar un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cotizacion_id:
 *                   type: string
 *                 saldo_restante:
 *                   type: number
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', pagoController.eliminarPago);

module.exports = router;