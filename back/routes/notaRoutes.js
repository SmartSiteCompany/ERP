const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notaController');

/**
 * @swagger
 * tags:
 *   name: Notas
 *   description: Endpoints para gestionar notas.
 */

/**
 * @swagger
 * /notas:
 *   get:
 *     summary: Obtener todas las notas.
 *     tags: [Notas]
 *     responses:
 *       200:
 *         description: Lista de notas obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nota'
 */
router.get('/', noteController.obtenerNotas);

/**
 * @swagger
 * /notas/{id}:
 *   get:
 *     summary: Obtener una nota por su ID.
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota.
 *     responses:
 *       200:
 *         description: Nota obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       404:
 *         description: Nota no encontrada.
 */
router.get('/:id', noteController.obtenerNotaPorId);

/**
 * @swagger
 * /notas:
 *   post:
 *     summary: Crear una nueva nota.
 *     tags: [Notas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nota'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             contenido: "El cliente está interesado en nuevos servicios."
 *             autor: "Juan Pérez"
 *     responses:
 *       201:
 *         description: Nota creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               contenido: "El cliente está interesado en nuevos servicios."
 *               fecha_creacion: "2023-10-01"
 *               autor: "Juan Pérez"
 */
router.post('/', noteController.crearNota);

/**
 * @swagger
 * /notas/{id}:
 *   put:
 *     summary: Actualizar una nota existente.
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nota'
 *           example:
 *             contenido: "El cliente está interesado en servicios adicionales."
 *     responses:
 *       200:
 *         description: Nota actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       404:
 *         description: Nota no encontrada.
 */
router.put('/:id', noteController.actualizarNota);

/**
 * @swagger
 * /notas/{id}:
 *   delete:
 *     summary: Eliminar una nota.
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota.
 *     responses:
 *       200:
 *         description: Nota eliminada exitosamente.
 *       404:
 *         description: Nota no encontrada.
 */
router.delete('/:id', noteController.eliminarNota);

module.exports = router;