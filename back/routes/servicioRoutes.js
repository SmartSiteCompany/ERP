const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

/**
 * @swagger
 * tags:
 *   name: Servicios Financiados
 *   description: Endpoints para gestionar servicios financiados.
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Obtener todos los servicios financiados.
 *     tags: [Servicios Financiados]
 *     responses:
 *       200:
 *         description: Lista de servicios financiados obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServicioFinanciado'
 */
router.get('/', servicioController.obtenerServiciosFinanciados);

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtener un servicio financiado por su ID.
 *     tags: [Servicios Financiados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio financiado.
 *     responses:
 *       200:
 *         description: Servicio financiado obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioFinanciado'
 *       404:
 *         description: Servicio financiado no encontrado.
 */
router.get('/:id', servicioController.obtenerServicioFinanciadoPorId);

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un nuevo servicio financiado.
 *     tags: [Servicios Financiados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicioFinanciado'
 *           example:
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             descripcion: "Instalación de cámaras"
 *             monto_servicio: 5000
 *             fecha_inicio: "2023-10-01"
 *             fecha_termino: "2023-12-31"
 *             pago_semanal: 500
 *             saldo_restante: 5000
 *     responses:
 *       201:
 *         description: Servicio financiado creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioFinanciado'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0k"
 *               cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               descripcion: "Instalación de cámaras"
 *               monto_servicio: 5000
 *               fecha_inicio: "2023-10-01"
 *               fecha_termino: "2023-12-31"
 *               pago_semanal: 500
 *               saldo_restante: 5000
 */
router.post('/', servicioController.crearServicioFinanciado);

/**
 * @swagger
 * /servicios-financiados/{id}:
 *   put:
 *     summary: Actualizar un servicio financiado existente.
 *     tags: [Servicios Financiados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio financiado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicioFinanciado'
 *           example:
 *             saldo_restante: 4500
 *     responses:
 *       200:
 *         description: Servicio financiado actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioFinanciado'
 *       404:
 *         description: Servicio financiado no encontrado.
 */

router.put('/:id', servicioController.actualizarServicioFinanciado);
/**
 * @swagger
 * /servicios-financiados/{id}:
 *   delete:
 *     summary: Eliminar un servicio financiado.
 *     tags: [Servicios Financiados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio financiado.
 *     responses:
 *       200:
 *         description: Servicio financiado eliminado exitosamente.
 *       404:
 *         description: Servicio financiado no encontrado.
 */
router.delete('/:id', servicioController.eliminarServicioFinanciado);

/**
 * @swagger
 * /servicios/cotizacion/{cotizacionId}:
 *   get:
 *     summary: Obtener servicios financiados por ID de cotización.
 *     tags: [Servicios Financiados]
 *     parameters:
 *       - in: path
 *         name: cotizacionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización relacionada.
 *     responses:
 *       200:
 *         description: Servicio financiado encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioFinanciado'
 *       404:
 *         description: No se encontró servicio financiado para esta cotización.
 */
router.get('/cotizacion/:cotizacionId', servicioController.obtenerServicioPorCotizacionId);

/**
 * @swagger
 * /servicios/{id}/pagos:
 *   get:
 *     summary: Obtener historial de pagos de un servicio
 *     tags: [Servicios Financiados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio financiado
 *     responses:
 *       200:
 *         description: Lista de pagos del servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *       404:
 *         description: No se encontraron pagos para este servicio
 */
router.get('/:id/pagos', servicioController.obtenerHistorialPagos);

/**
 * @swagger
 * /servicios/{id}/registrar-pago:
 *   post:
 *     summary: Registrar un nuevo pago para el servicio
 *     tags: [Servicios Financiados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio financiado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto_pago
 *             properties:
 *               monto_pago:
 *                 type: number
 *                 description: Monto del pago realizado
 *               nuevo_pago_semanal:
 *                 type: number
 *                 description: Nuevo monto de pago semanal (opcional)
 *           example:
 *             monto_pago: 1500
 *             nuevo_pago_semanal: 500
 *     responses:
 *       200:
 *         description: Pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 servicio:
 *                   $ref: '#/components/schemas/ServicioFinanciado'
 *                 pago:
 *                   $ref: '#/components/schemas/Pago'
 *                 msg:
 *                   type: string
 *       400:
 *         description: Monto excede el saldo pendiente
 *       404:
 *         description: Servicio no encontrado
 */

module.exports = router;