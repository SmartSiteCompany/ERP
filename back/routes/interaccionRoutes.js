const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interaccionController');

/**
 * @swagger
 * tags:
 *   name: Interacciones
 *   description: Endpoints para gestionar interacciones.
 */

/**
 * @swagger
 * /interacciones:
 *   get:
 *     summary: Obtener todas las interacciones.
 *     tags: [Interacciones]
 *     responses:
 *       200:
 *         description: Lista de interacciones obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Interaccion'
 */
router.get('/', interactionController.obtenerInteracciones);

/**
 * @swagger
 * /interacciones/{id}:
 *   get:
 *     summary: Obtener una interacción por su ID.
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la interacción.
 *     responses:
 *       200:
 *         description: Interacción obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interaccion'
 *       404:
 *         description: Interacción no encontrada.
 */
router.get('/:id', interactionController.obtenerInteraccionPorId);

/**
 * @swagger
 * /interacciones:
 *   post:
 *     summary: Crear una nueva interacción.
 *     tags: [Interacciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interaccion'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             tipo_interaccion: "llamada"
 *             descripcion: "Llamada de seguimiento."
 *             responsable: "Juan Pérez"
 *     responses:
 *       201:
 *         description: Interacción creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interaccion'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               tipo_interaccion: "llamada"
 *               fecha: "2023-10-01"
 *               descripcion: "Llamada de seguimiento."
 *               responsable: "Juan Pérez"
 *               estado: "completada"
 */
router.post('/', interactionController.crearInteraccion);

/**
 * @swagger
 * /interacciones/{id}:
 *   put:
 *     summary: Actualizar una interacción existente.
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la interacción.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interaccion'
 *           example:
 *             descripcion: "Llamada de seguimiento actualizada."
 *             estado: "completada"
 *     responses:
 *       200:
 *         description: Interacción actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interaccion'
 *       404:
 *         description: Interacción no encontrada.
 */
router.put('/:id', interactionController.actualizarInteraccion);

/**
 * @swagger
 * /interacciones/{id}:
 *   delete:
 *     summary: Eliminar una interacción.
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la interacción.
 *     responses:
 *       200:
 *         description: Interacción eliminada exitosamente.
 *       404:
 *         description: Interacción no encontrada.
 */
router.delete('/:id', interactionController.eliminarInteraccion);

module.exports = router;