const express = require('express');
const router = express.Router();
const estadoCuentaController = require('../controllers/estadoCuentaController');

/**
 * @swagger
 * tags:
 *   name: Estados de Cuenta
 *   description: Endpoints para gestionar estados de cuenta.
 */

/**
 * @swagger
 * /estados-cuenta:
 *   get:
 *     summary: Obtener todos los estados de cuenta.
 *     tags: [Estados de Cuenta]
 *     responses:
 *       200:
 *         description: Lista de estados de cuenta obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstadoCuenta'
 */

router.get('/', estadoCuentaController.obtenerEstadosCuenta);

/**
 * @swagger
 * /estados-cuenta/{id}:
 *   get:
 *     summary: Obtener un estado de cuenta por su ID.
 *     tags: [Estados de Cuenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado de cuenta.
 *     responses:
 *       200:
 *         description: Estado de cuenta obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoCuenta'
 *       404:
 *         description: Estado de cuenta no encontrado.
 */
router.get('/:id', estadoCuentaController.obtenerEstadoCuentaPorId);

/**
 * @swagger
 * /estados-cuenta:
 *   post:
 *     summary: Crear un nuevo estado de cuenta.
 *     tags: [Estados de Cuenta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstadoCuenta'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             servicio_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *             fecha_estado: "2023-10-15"
 *             saldo_inicial: 5000
 *             pago_total: 500
 *             saldo_actual: 4500
 *             pago_semanal: 500
 *             total_a_pagar: 5000
 *     responses:
 *       201:
 *         description: Estado de cuenta creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoCuenta'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0m"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               servicio_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               fecha_estado: "2023-10-15"
 *               saldo_inicial: 5000
 *               pago_total: 500
 *               saldo_actual: 4500
 *               pago_semanal: 500
 *               total_a_pagar: 5000
 */
router.post('/', estadoCuentaController.crearEstadoCuenta);

/**
 * @swagger
 * /estados-cuenta/{id}:
 *   put:
 *     summary: Actualizar un estado de cuenta existente.
 *     tags: [Estados de Cuenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado de cuenta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstadoCuenta'
 *           example:
 *             saldo_actual: 4400
 *             pago_total: 600
 *     responses:
 *       200:
 *         description: Estado de cuenta actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoCuenta'
 *       404:
 *         description: Estado de cuenta no encontrado.
 */
router.put('/:id', estadoCuentaController.actualizarEstadoCuenta);

/**
 * @swagger
 * /estados-cuenta/{id}:
 *   delete:
 *     summary: Eliminar un estado de cuenta.
 *     tags: [Estados de Cuenta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado de cuenta.
 *     responses:
 *       200:
 *         description: Estado de cuenta eliminado exitosamente.
 *       404:
 *         description: Estado de cuenta no encontrado.
 */
router.delete('/:id', estadoCuentaController.eliminarEstadoCuenta);

module.exports = router;