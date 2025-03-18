const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Endpoints para gestionar pagos.
 */
/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Obtener todos los pagos.
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida exitosamente.
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
 * /pagos/{id}:
 *   get:
 *     summary: Obtener un pago por su ID.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago.
 *     responses:
 *       200:
 *         description: Pago obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado.
 */
router.get('/:id', pagoController.obtenerPagoPorId);

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Crear un nuevo pago.
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             servicio_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *             fecha_pago: "2023-10-15"
 *             monto_pago: 500
 *             saldo_pendiente: 4500
 *             nuevo_pago_semanal: 500
 *     responses:
 *       201:
 *         description: Pago creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0l"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               servicio_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               fecha_pago: "2023-10-15"
 *               monto_pago: 500
 *               saldo_pendiente: 4500
 *               nuevo_pago_semanal: 500
 */
router.post('/', pagoController.crearPago);

/**
 * @swagger
 * /pagos/{id}:
 *   put:
 *     summary: Actualizar un pago existente.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *           example:
 *             monto_pago: 600
 *             saldo_pendiente: 4400
 *             nuevo_pago_semanal: 600
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado.
 */
router.put('/:id', pagoController.actualizarPago);

/**
 * @swagger
 * /pagos/{id}:
 *   delete:
 *     summary: Eliminar un pago.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago.
 *     responses:
 *       200:
 *         description: Pago eliminado exitosamente.
 *       404:
 *         description: Pago no encontrado.
 */
router.delete('/:id', pagoController.eliminarPago);

module.exports = router;