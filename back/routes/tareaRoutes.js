const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tareaController');

/**
 * @swagger
 * tags:
 *   name: Tareas
 *   description: Endpoints para gestionar tareas.
 */

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: Obtener todas las tareas.
 *     tags: [Tareas]
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarea'
 */
router.get('/', taskController.obtenerTareas);

/**
 * @swagger
 * /tareas/{id}:
 *   get:
 *     summary: Obtener una tarea por su ID.
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea.
 *     responses:
 *       200:
 *         description: Tarea obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       404:
 *         description: Tarea no encontrada.
 */
router.get('/:id', taskController.obtenerTareaPorId);

/**
 * @swagger
 * /tareas:
 *   post:
 *     summary: Crear una nueva tarea.
 *     tags: [Tareas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tarea'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             descripcion: "Seguimiento con el cliente."
 *             fecha_vencimiento: "2023-10-15"
 *             responsable: "Juan Pérez"
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               descripcion: "Seguimiento con el cliente."
 *               fecha_vencimiento: "2023-10-15"
 *               estado: "pendiente"
 *               responsable: "Juan Pérez"
 */
router.post('/', taskController.crearTarea);

/**
 * @swagger
 * /tareas/{id}:
 *   put:
 *     summary: Actualizar una tarea existente.
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tarea'
 *           example:
 *             estado: "completada"
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       404:
 *         description: Tarea no encontrada.
 */
router.put('/:id', taskController.actualizarTarea);

/**
 * @swagger
 * /tareas/{id}:
 *   delete:
 *     summary: Eliminar una tarea.
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea.
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente.
 *       404:
 *         description: Tarea no encontrada.
 */
router.delete('/:id', taskController.eliminarTarea);

module.exports = router;