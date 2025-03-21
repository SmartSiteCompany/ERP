const express = require('express');
const router = express.Router();
const { generarPDFCotizacionServicio } = require('../controllers/pdfController');

// Ruta para generar el PDF de cotización y servicio
/**
 * @swagger
 * /api/generar-pdf/{cotizacionId}/{servicioId}:
 *   get:
 *     summary: Genera un PDF combinando una cotización y un servicio financiado.
 *     description: Obtiene los detalles de una cotización y un servicio financiado, y genera un PDF con la información combinada.
 *     parameters:
 *       - in: path
 *         name: cotizacionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización.
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio financiado.
 *     responses:
 *       200:
 *         description: PDF generado exitosamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en los parámetros de entrada (IDs no válidos o no pertenecen al mismo cliente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Cotización o servicio no encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
// Ruta para generar el PDF de cotización y servicio
router.get('/generar-pdf/:cotizacionId/:servicioId', generarPDFCotizacionServicio);

module.exports = router;