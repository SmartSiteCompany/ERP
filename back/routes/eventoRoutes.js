const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventoController');

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Endpoints para gestionar eventos.
 */

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Obtener todos los eventos.
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 */
router.get('/', eventController.obtenerEventos);

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Obtener un evento por su ID.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento.
 *     responses:
 *       200:
 *         description: Evento obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Evento no encontrado.
 */
router.get('/:id', eventController.obtenerEventoPorId);

/**
 * @swagger
 * /eventos:
 *   post:
 *     summary: Crear un nuevo evento.
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *           example:
 *             nombre: "Conferencia de Tecnología"
 *             descripcion: "Evento anual de tecnología."
 *             fecha: "2023-11-15"
 *             ubicacion: "Centro de Convenciones"
 *             clientes: ["64f1a2b3c4d5e6f7g8h9i0j"]
 *     responses:
 *       201:
 *         description: Evento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0l"
 *               nombre: "Conferencia de Tecnología"
 *               descripcion: "Evento anual de tecnología."
 *               fecha: "2023-11-15"
 *               ubicacion: "Centro de Convenciones"
 *               clientes: ["64f1a2b3c4d5e6f7g8h9i0j"]
 */
router.post('/', eventController.crearEvento);

/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     summary: Actualizar un evento existente.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *           example:
 *             descripcion: "Evento anual de tecnología e innovación."
 *             ubicacion: "Centro de Convenciones Actualizado"
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Evento no encontrado.
 */
router.put('/:id', eventController.actualizarEvento);

/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     summary: Eliminar un evento.
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento.
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente.
 *       404:
 *         description: Evento no encontrado.
 */
router.delete('/:id', eventController.eliminarEvento);

module.exports = router;