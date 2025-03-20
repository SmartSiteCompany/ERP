const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentoController');

/**
 * @swagger
 * tags:
 *   name: Documentos
 *   description: Endpoints para gestionar documentos.
 */

/**
 * @swagger
 * /documentos:
 *   get:
 *     summary: Obtener todos los documentos.
 *     tags: [Documentos]
 *     responses:
 *       200:
 *         description: Lista de documentos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Documento'
 */
router.get('/', documentController.obtenerDocumentos);

/**
 * @swagger
 * /documentos/{id}:
 *   get:
 *     summary: Obtener un documento por su ID.
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del documento.
 *     responses:
 *       200:
 *         description: Documento obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 *       404:
 *         description: Documento no encontrado.
 */
router.get('/:id', documentController.obtenerDocumentoPorId);

/**
 * @swagger
 * /documentos:
 *   post:
 *     summary: Crear un nuevo documento.
 *     tags: [Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Documento'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             nombre: "Contrato de Servicio"
 *             tipo: "contrato"
 *             archivo: "https://example.com/archivo.pdf"
 *     responses:
 *       201:
 *         description: Documento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               nombre: "Contrato de Servicio"
 *               tipo: "contrato"
 *               fecha_subida: "2023-10-01"
 *               archivo: "https://example.com/archivo.pdf"
 */
router.post('/', documentController.crearDocumento);

/**
 * @swagger
 * /documentos/{id}:
 *   put:
 *     summary: Actualizar un documento existente.
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del documento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Documento'
 *           example:
 *             nombre: "Contrato Actualizado"
 *             tipo: "contrato"
 *             archivo: "https://example.com/archivo_actualizado.pdf"
 *     responses:
 *       200:
 *         description: Documento actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 *       404:
 *         description: Documento no encontrado.
 */
router.put('/:id', documentController.actualizarDocumento);

/**
 * @swagger
 * /documentos/{id}:
 *   delete:
 *     summary: Eliminar un documento.
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del documento.
 *     responses:
 *       200:
 *         description: Documento eliminado exitosamente.
 *       404:
 *         description: Documento no encontrado.
 */
router.delete('/:id', documentController.eliminarDocumento);

module.exports = router;