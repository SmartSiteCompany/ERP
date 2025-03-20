const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campanaController');

/**
 * @swagger
 * /change-logs/{id}:
 *   delete:
 *     summary: Eliminar un registro de cambio.
 *     tags: [ChangeLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro de cambio.
 *     responses:
 *       200:
 *         description: Registro de cambio eliminado exitosamente.
 *       404:
 *         description: Registro de cambio no encontrado.
 */
router.get('/', campaignController.obtenerCampaigns);

/**
 * @swagger
 * /campanas/{id}:
 *   get:
 *     summary: Obtener una campaña por su ID.
 *     tags: [Campañas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la campaña.
 *     responses:
 *       200:
 *         description: Campaña obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campana'
 *       404:
 *         description: Campaña no encontrada.
 */
router.get('/:id', campaignController.obtenerCampaignPorId);

/**
 * @swagger
 * /campanas:
 *   post:
 *     summary: Crear una nueva campaña.
 *     tags: [Campañas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campana'
 *           example:
 *             nombre: "Campaña de Otoño"
 *             descripcion: "Descuentos especiales en servicios."
 *             fecha_inicio: "2023-10-01"
 *             fecha_fin: "2023-12-31"
 *             estado: "activa"
 *             clientes: ["64f1a2b3c4d5e6f7g8h9i0j"]
 *     responses:
 *       201:
 *         description: Campaña creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campana'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0l"
 *               nombre: "Campaña de Otoño"
 *               descripcion: "Descuentos especiales en servicios."
 *               fecha_inicio: "2023-10-01"
 *               fecha_fin: "2023-12-31"
 *               estado: "activa"
 *               clientes: ["64f1a2b3c4d5e6f7g8h9i0j"]
 */
router.post('/', campaignController.crearCampaign);

/**
 * @swagger
 * /campanas/{id}:
 *   put:
 *     summary: Actualizar una campaña existente.
 *     tags: [Campañas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la campaña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campana'
 *           example:
 *             estado: "completada"
 *     responses:
 *       200:
 *         description: Campaña actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campana'
 *       404:
 *         description: Campaña no encontrada.
 */
router.put('/:id', campaignController.actualizarCampaign);

/**
 * @swagger
 * /campanas/{id}:
 *   delete:
 *     summary: Eliminar una campaña.
 *     tags: [Campañas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la campaña.
 *     responses:
 *       200:
 *         description: Campaña eliminada exitosamente.
 *       404:
 *         description: Campaña no encontrada.
 */
router.delete('/:id', campaignController.eliminarCampaign);

module.exports = router;