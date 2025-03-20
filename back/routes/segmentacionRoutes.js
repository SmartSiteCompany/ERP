const express = require('express');
const router = express.Router();
const segmentationController = require('../controllers/segmentacionController');

/**
 * @swagger
 * tags:
 *   name: Segmentaciones
 *   description: Endpoints para gestionar segmentaciones.
 */

/**
 * @swagger
 * /segmentaciones:
 *   get:
 *     summary: Obtener todas las segmentaciones.
 *     tags: [Segmentaciones]
 *     responses:
 *       200:
 *         description: Lista de segmentaciones obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Segmentacion'
 */
router.get('/', segmentationController.obtenerSegmentaciones);

/**
 * @swagger
 * /segmentaciones/{id}:
 *   get:
 *     summary: Obtener una segmentación por su ID.
 *     tags: [Segmentaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la segmentación.
 *     responses:
 *       200:
 *         description: Segmentación obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Segmentacion'
 *       404:
 *         description: Segmentación no encontrada.
 */
router.get('/:id', segmentationController.obtenerSegmentacionPorId);

/**
 * @swagger
 * /segmentaciones:
 *   post:
 *     summary: Crear una nueva segmentación.
 *     tags: [Segmentaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Segmentacion'
 *           example:
 *             nombre: "Segmentación Empresas"
 *             descripcion: "Clientes de tipo empresa."
 *             criterios: "tipo_cliente: Empresa"
 *             clientes: ["64f1a2b3c4d5e6f7g8h9i0j"]
 *     responses:
 *       201:
 *         description: Segmentación creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Segmentacion'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               nombre: "Segmentación Empresas"
 *               descripcion: "Clientes de tipo empresa."
 *               criterios: "tipo_cliente: Empresa"
 *               clientes: ["64f1a2b3c4d5e6f7g8h9i0j"]
 */
router.post('/', segmentationController.crearSegmentacion);

/**
 * @swagger
 * /segmentaciones/{id}:
 *   put:
 *     summary: Actualizar una segmentación existente.
 *     tags: [Segmentaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la segmentación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Segmentacion'
 *           example:
 *             descripcion: "Clientes de tipo empresa con facturación mayor a $10,000."
 *             criterios: "tipo_cliente: Empresa, facturacion: >10000"
 *     responses:
 *       200:
 *         description: Segmentación actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Segmentacion'
 *       404:
 *         description: Segmentación no encontrada.
 */
router.put('/:id', segmentationController.actualizarSegmentacion);

/**
 * @swagger
 * /segmentaciones/{id}:
 *   delete:
 *     summary: Eliminar una segmentación.
 *     tags: [Segmentaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la segmentación.
 *     responses:
 *       200:
 *         description: Segmentación eliminada exitosamente.
 *       404:
 *         description: Segmentación no encontrada.
 */
router.delete('/:id', segmentationController.eliminarSegmentacion);

module.exports = router;