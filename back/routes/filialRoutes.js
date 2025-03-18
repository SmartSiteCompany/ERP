const express = require('express');
const router = express.Router();
const filialController = require('../controllers/filialController');

/**
 * @swagger
 * /filiales:
 *   get:
 *     summary: Obtener todas las filiales
 *     tags: [Filiales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de filiales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Filial'
 */
router.get('/', filialController.obtenerFiliales);

/**
 * @swagger
 * /filiales/{id}:
 *   get:
 *     summary: Obtener una filial por ID
 *     tags: [Filiales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la filial
 *     responses:
 *       200:
 *         description: Detalles de la filial
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filial'
 *       404:
 *         description: Filial no encontrada
 */
router.get('/:id', filialController.obtenerFilialPorId);

/**
 * @swagger
 * /filiales:
 *   post:
 *     summary: Crear una nueva filial
 *     tags: [Filiales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filial'
 *     responses:
 *       201:
 *         description: Filial creada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', filialController.crearFilial);

/**
 * @swagger
 * /filiales/{id}:
 *   put:
 *     summary: Actualizar una filial
 *     tags: [Filiales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la filial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filial'
 *     responses:
 *       200:
 *         description: Filial actualizada
 *       404:
 *         description: Filial no encontrada
 */
router.put('/:id', filialController.actualizarFilial);

/**
 * @swagger
 * /filiales/{id}:
 *   delete:
 *     summary: Eliminar una filial
 *     tags: [Filiales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la filial
 *     responses:
 *       200:
 *         description: Filial eliminada correctamente
 *       404:
 *         description: Filial no encontrada
 */
router.delete('/:id', filialController.eliminarFilial);

module.exports = router;