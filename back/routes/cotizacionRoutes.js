// src/routes/cotizacionRoutes.js
const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');
const pdfController = require('../controllers/pdfController');
const { validatePaymentMethod } = require('../middlewares/paymentValidation');

/**
 * @swagger
 * tags:
 *   name: Cotizaciones
 *   description: Gestión de cotizaciones y servicios
 */

/**
 * @swagger
 * /api/cotizaciones:
 *   get:
 *     summary: Obtener todas las cotizaciones
 *     tags: [Cotizaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Borrador, Enviada, Aprobada, Completada, Cancelada]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de cotizaciones
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
 * /api/cotizaciones/{id}:
 *   get:
 *     summary: Obtener una cotización por ID
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Detalles completos de la cotización
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       404:
 *         description: Cotización no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorAPI'
 */

router.get('/:id', cotizacionController.obtenerCotizacionPorId);

/**
 * @swagger
 * /api/cotizaciones:
 *   post:
 *     summary: Crear nueva cotización
 *     tags: [Cotizaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cotizacion'
 *     responses:
 *       201:
 *         description: Cotización creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 */

router.post( // Ruta para cotizaciones
    '/', 
    validatePaymentMethod, // Nuevo middleware
    cotizacionController.crearCotizacion
  );

/**
 * @swagger
 * /api/cotizaciones/{id}:
 *   put:
 *     summary: Actualizar cotización existente
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cotizacion'
 *     responses:
 *       200:
 *         description: Cotización actualizada
 *       404:
 *         description: Cotización no encontrada
 */
router.put('/:id', cotizacionController.actualizarCotizacion);

/**
 * @swagger
 * /api/cotizaciones/{id}:
 *   delete:
 *     summary: Eliminar una cotización
 *     tags: [Cotizaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *         description: ID de la cotización a eliminar
 *     responses:
 *       200:
 *         description: Cotización eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Cotización eliminada exitosamente"
 *                 cotizacion_id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *       403:
 *         description: No autorizado (solo administradores o creadores pueden eliminar)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorAPI'
 *       404:
 *         description: Cotización no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorAPI'
 *       409:
 *         description: Conflicto (no se puede eliminar cotización con pagos registrados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se puede eliminar cotización con pagos asociados"
 *                 pagos_existentes:
 *                   type: integer
 *                   example: 2
 */
router.delete('/:id', cotizacionController.eliminarCotizacion);
// ==============================================
// Operaciones de Servicios
// ==============================================

/**
 * @swagger
 * /api/cotizaciones/{id}/activar:
 *   post:
 *     summary: Activar servicio asociado a cotización
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio activado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Servicio activado"
 *                 fecha_inicio:
 *                   type: string
 *                   format: date-time
 */
router.post('/:id/activar', cotizacionController.activarServicio);

/**
 * @swagger
 * /api/cotizaciones/{id}/completar:
 *   post:
 *     summary: Marcar servicio como completado
 *     description: Actualiza el estado de un servicio asociado a una cotización a "Completado" y registra la fecha de finalización
 *     tags: [Cotizaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *         description: ID de la cotización asociada al servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - observaciones
 *             properties:
 *               observaciones:
 *                 type: string
 *                 example: "Instalación terminada según lo acordado"
 *               fecha_fin_real:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-08-15T14:30:00Z"
 *               evaluacion_servicio:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Servicio marcado como completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Servicio completado exitosamente"
 *                 cotizacion_id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 nuevo_estado:
 *                   type: string
 *                   example: "Completada"
 *                 fecha_fin_servicio:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorAPI'
 *       404:
 *         description: Cotización no encontrada o servicio no activo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El servicio no está activo"
 *       409:
 *         description: Conflicto en el estado actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El servicio ya estaba completado"
 *                 estado_actual:
 *                   type: string
 *                   example: "Completado"
 */
router.post('/:id/completar', cotizacionController.completarServicio);

/**
 * @swagger
 * /api/cotizaciones/servicios/{estado}:
 *   get:
 *     summary: Obtener servicios por estado
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Pendiente, En Proceso, Completado, Cancelado]
 *     responses:
 *       200:
 *         description: Lista de servicios filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cotizacion'
 */
router.get('/servicios/:estado', cotizacionController.obtenerServiciosPorEstado);

// ==============================================
// Operaciones de Pagos (para servicios financiados)
// ==============================================

/**
 * @swagger
 * /api/cotizaciones/{id}/pagos:
 *   post:
 *     summary: Registrar pago para cotización financiada
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoCuenta'
 */
router.post('/:id/pagos', cotizacionController.registrarPago);

/**
 * @swagger
 * /api/cotizaciones/{id}/pagos:
 *   get:
 *     summary: Obtener historial de pagos
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pagos asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 */
router.get('/:id/pagos', cotizacionController.obtenerHistorialPagos);

// Generador de PDFs
/**
 * @swagger
 * /api/cotizaciones/{id}/pdf:
 *   get:
 *     summary: Generar PDF de cotización
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Cotización no encontrada
 */
router.get('/:id/pdf', cotizacionController.verificarCotizacion, pdfController.generarPDFCotizacion);
module.exports = router;