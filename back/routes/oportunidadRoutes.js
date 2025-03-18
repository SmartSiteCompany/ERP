const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/oportunidadController');

/**
 * @swagger
 * tags:
 *   name: Oportunidades
 *   description: Endpoints para gestionar oportunidades.
 */

/**
 * @swagger
 * /oportunidades:
 *   get:
 *     summary: Obtener todas las oportunidades.
 *     tags: [Oportunidades]
 *     responses:
 *       200:
 *         description: Lista de oportunidades obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Oportunidad'
 */
router.get('/', opportunityController.obtenerOportunidades);

/**
 * @swagger
 * /oportunidades/{id}:
 *   get:
 *     summary: Obtener una oportunidad por su ID.
 *     tags: [Oportunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oportunidad.
 *     responses:
 *       200:
 *         description: Oportunidad obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Oportunidad'
 *       404:
 *         description: Oportunidad no encontrada.
 */
router.get('/:id', opportunityController.obtenerOportunidadPorId);

/**
 * @swagger
 * /oportunidades:
 *   post:
 *     summary: Crear una nueva oportunidad.
 *     tags: [Oportunidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Oportunidad'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             descripcion: "Oportunidad de venta de servicios adicionales."
 *             valor_estimado: 10000
 *             fecha_cierre_estimada: "2023-12-31"
 *             responsable: "Juan Pérez"
 *     responses:
 *       201:
 *         description: Oportunidad creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Oportunidad'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               descripcion: "Oportunidad de venta de servicios adicionales."
 *               valor_estimado: 10000
 *               fecha_cierre_estimada: "2023-12-31"
 *               estado: "en progreso"
 *               responsable: "Juan Pérez"
 */
router.post('/', opportunityController.crearOportunidad);

/**
 * @swagger
 * /oportunidades/{id}:
 *   put:
 *     summary: Actualizar una oportunidad existente.
 *     tags: [Oportunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oportunidad.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Oportunidad'
 *           example:
 *             estado: "ganada"
 *             valor_estimado: 12000
 *     responses:
 *       200:
 *         description: Oportunidad actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Oportunidad'
 *       404:
 *         description: Oportunidad no encontrada.
 */
router.put('/:id', opportunityController.actualizarOportunidad);

/**
 * @swagger
 * /oportunidades/{id}:
 *   delete:
 *     summary: Eliminar una oportunidad.
 *     tags: [Oportunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oportunidad.
 *     responses:
 *       200:
 *         description: Oportunidad eliminada exitosamente.
 *       404:
 *         description: Oportunidad no encontrada.
 */
router.delete('/:id', opportunityController.eliminarOportunidad);

module.exports = router;