const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: Endpoints para gestionar feedbacks.
 */

/**
 * @swagger
 * /feedbacks:
 *   get:
 *     summary: Obtener todos los feedbacks.
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: Lista de feedbacks obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 */
router.get('/', feedbackController.obtenerFeedbacks);

/**
 * @swagger
 * /feedbacks/{id}:
 *   get:
 *     summary: Obtener un feedback por su ID.
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del feedback.
 *     responses:
 *       200:
 *         description: Feedback obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback no encontrado.
 */
router.get('/:id', feedbackController.obtenerFeedbackPorId);

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Crear un nuevo feedback.
 *     tags: [Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             comentario: "Excelente servicio."
 *             calificacion: 5
 *     responses:
 *       201:
 *         description: Feedback creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               comentario: "Excelente servicio."
 *               fecha: "2023-10-01"
 *               calificacion: 5
 */
router.post('/', feedbackController.crearFeedback);

/**
 * @swagger
 * /feedbacks/{id}:
 *   put:
 *     summary: Actualizar un feedback existente.
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del feedback.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *           example:
 *             comentario: "Servicio muy profesional."
 *             calificacion: 4
 *     responses:
 *       200:
 *         description: Feedback actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback no encontrado.
 */
router.put('/:id', feedbackController.actualizarFeedback);

/**
 * @swagger
 * /feedbacks/{id}:
 *   delete:
 *     summary: Eliminar un feedback.
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del feedback.
 *     responses:
 *       200:
 *         description: Feedback eliminado exitosamente.
 *       404:
 *         description: Feedback no encontrado.
 */
router.delete('/:id', feedbackController.eliminarFeedback);

module.exports = router;