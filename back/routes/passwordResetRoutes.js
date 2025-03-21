const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

/**
 * @swagger
 * tags:
 *   name: Restablecimiento de Contraseña
 *   description: Endpoints para gestionar restablecimiento de contraseñas.
 */

/**
 * @swagger
 * /password-resets:
 *   post:
 *     summary: Crear un registro de restablecimiento de contraseña
 *     tags: [Restablecimiento de Contraseña]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registro de restablecimiento creado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', passwordResetController.crearPasswordReset);

/**
 * @swagger
 * /password-resets/{token}:
 *   get:
 *     summary: Obtener un registro de restablecimiento por token
 *     tags: [Restablecimiento de Contraseña]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de restablecimiento
 *     responses:
 *       200:
 *         description: Detalles del registro de restablecimiento
 *       404:
 *         description: Token no encontrado
 */
router.get('/:token', passwordResetController.obtenerPasswordResetPorToken);

/**
 * @swagger
 * /password-resets/{token}:
 *   delete:
 *     summary: Eliminar un registro de restablecimiento
 *     tags: [Restablecimiento de Contraseña]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de restablecimiento
 *     responses:
 *       200:
 *         description: Registro de restablecimiento eliminado
 *       404:
 *         description: Token no encontrado
 */
router.delete('/:token', passwordResetController.eliminarPasswordReset);

module.exports = router;