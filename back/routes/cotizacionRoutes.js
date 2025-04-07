const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

/**
 * @swagger
* tags:
*   name: Cotizaciones
*   description: Endpoints para gestionar cotizaciones.
*/

/**
* @swagger
* /cotizaciones:
*   get:
*     summary: Obtener todas las cotizaciones.
*     tags: [Cotizaciones]
*     responses:
*       200:
*         description: Lista de cotizaciones obtenida exitosamente.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Cotizacion'
*/
router.get('/', cotizacionController.obtenerCotizaciones);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   get:
 *     summary: Obtener una cotización por su ID.
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización.
 *     responses:
 *       200:
 *         description: Cotización obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       404:
 *         description: Cotización no encontrada.
 */
router.get('/:id', cotizacionController.obtenerCotizacionPorId);

/**
 * @swagger
 * /cotizaciones:
 *   post:
 *     summary: Crear una nueva cotización.
 *     tags: [Cotizaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cotizacion'
 *           example:
 *             nombre_cotizacion: "Cotización 1"
 *             forma_pago: "Financiado"
 *             precio_venta: 5000
 *             anticipo_solicitado: 1000
 *             filial_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             servicio_id: "64f1a2b3c4d5e6f7g8h9i0l"
 *             detalles:
 *               - descripcion: "Instalación de cámaras"
 *                 costo_materiales: 2000
 *                 costo_mano_obra: 1000
 *                 inversion: 3000
 *                 utilidad_esperada: 2000
 *     responses:
 *       201:
 *         description: Cotización creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0m"
 *               fecha_cotizacion: "2023-10-01"
 *               forma_pago: "Financiado"
 *               precio_venta: 5000
 *               anticipo_solicitado: 1000
 *               filial: "Filial A"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               detalles:
 *                 - descripcion: "Instalación de cámaras"
 *                   costo_materiales: 2000
 *                   costo_mano_obra: 1000
 *                   inversion: 3000
 *                   utilidad_esperada: 2000
 */
router.post('/', cotizacionController.crearCotizacion);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   put:
 *     summary: Actualizar una cotización existente.
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cotizacion'
 *           example:
 *             precio_venta: 5500
 *     responses:
 *       200:
 *         description: Cotización actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       404:
 *         description: Cotización no encontrada.
 */
router.put('/:id', cotizacionController.actualizarCotizacion);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   delete:
 *     summary: Eliminar una cotización.
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización.
 *     responses:
 *       200:
 *         description: Cotización eliminada exitosamente.
 *       404:
 *         description: Cotización no encontrada.
 */
router.delete('/:id', cotizacionController.eliminarCotizacion);

module.exports = router;