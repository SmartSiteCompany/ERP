const express = require('express');
const router = express.Router();
const changeLogController = require('../controllers/changeLogController');

/**
 * @swagger
 * tags:
 *   name: ChangeLogs
 *   description: Endpoints para gestionar registros de cambios.
 */

/**
 * @swagger
 * /change-logs:
 *   get:
 *     summary: Obtener todos los registros de cambios.
 *     tags: [ChangeLogs]
 *     responses:
 *       200:
 *         description: Lista de registros de cambios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChangeLog'
 */
router.get('/', changeLogController.obtenerChangeLogs);

/**
 * @swagger
 * /change-logs/{id}:
 *   get:
 *     summary: Obtener un registro de cambio por su ID.
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
 *         description: Registro de cambio obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeLog'
 *       404:
 *         description: Registro de cambio no encontrado.
 */
router.get('/:id', changeLogController.obtenerChangeLogPorId);

/**
 * @swagger
 * /change-logs:
 *   post:
 *     summary: Crear un nuevo registro de cambio.
 *     tags: [ChangeLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeLog'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             campo_modificado: "telefono"
 *             valor_anterior: "555-1234"
 *             valor_nuevo: "555-5678"
 *             responsable: "Admin"
 *     responses:
 *       201:
 *         description: Registro de cambio creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeLog'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               campo_modificado: "telefono"
 *               valor_anterior: "555-1234"
 *               valor_nuevo: "555-5678"
 *               fecha_cambio: "2023-10-01"
 *               responsable: "Admin"
 */
router.post('/', changeLogController.crearChangeLog);

/**
 * @swagger
 * /change-logs/{id}:
 *   put:
 *     summary: Actualizar un registro de cambio existente.
 *     tags: [ChangeLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro de cambio.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeLog'
 *           example:
 *             campo_modificado: "direccion"
 *             valor_anterior: "Calle Falsa 123"
 *             valor_nuevo: "Avenida Siempre Viva 456"
 *             responsable: "Admin"
 *     responses:
 *       200:
 *         description: Registro de cambio actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangeLog'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               campo_modificado: "direccion"
 *               valor_anterior: "Calle Falsa 123"
 *               valor_nuevo: "Avenida Siempre Viva 456"
 *               fecha_cambio: "2023-10-01"
 *               responsable: "Admin"
 *       404:
 *         description: Registro de cambio no encontrado.
 */
router.put('/:id', changeLogController.actualizarChangeLog);

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
router.delete('/:id', changeLogController.eliminarChangeLog);

module.exports = router;