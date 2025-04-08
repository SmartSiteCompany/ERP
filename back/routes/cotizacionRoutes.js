// src/routes/cotizacionRoutes.js
const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

/**
 * @swagger
 * tags:
 *   name: Cotizaciones
 *   description: Endpoints para gestionar cotizaciones y servicios asociados
 * 
 * components:
 *   schemas:
 *     Cotizacion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la cotización
 *         numero:
 *           type: string
 *           description: Número de cotización
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         validoHasta:
 *           type: string
 *           format: date-time
 *           description: Fecha de validez
 *         estado:
 *           type: string
 *           enum: [Borrador, Enviada, Aprobada, Completada, Cancelada]
 *           description: Estado actual de la cotización
 *         cliente:
 *           $ref: '#/components/schemas/Cliente'
 *         vendedor:
 *           type: string
 *           description: Nombre del vendedor
 *         filial:
 *           $ref: '#/components/schemas/Filial'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemCotizacion'
 *         subtotal:
 *           type: number
 *           description: Subtotal antes de impuestos
 *         iva:
 *           type: number
 *           description: Monto de IVA
 *         total:
 *           type: number
 *           description: Total a pagar
 *         tipo:
 *           type: string
 *           enum: [Contado, Financiado]
 *           description: Tipo de pago
 *         financiamiento:
 *           $ref: '#/components/schemas/Financiamiento'
 *         pagoContado:
 *           $ref: '#/components/schemas/PagoContado'
 *         estadoServicio:
 *           type: string
 *           enum: [Pendiente, Activo, Completado, Cancelado]
 *           description: Estado del servicio asociado
 * 
 *     Cliente:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nombre:
 *           type: string
 *         email:
 *           type: string
 * 
 *     Filial:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nombre:
 *           type: string
 * 
 *     ItemCotizacion:
 *       type: object
 *       properties:
 *         descripcion:
 *           type: string
 *         cantidad:
 *           type: number
 *         precio:
 *           type: number
 *         total:
 *           type: number
 * 
 *     Financiamiento:
 *       type: object
 *       properties:
 *         anticipo:
 *           type: number
 *         plazo:
 *           type: number
 *         pagoSemanal:
 *           type: number
 *         saldoRestante:
 *           type: number
 * 
 *     PagoContado:
 *       type: object
 *       properties:
 *         fechaPago:
 *           type: string
 *           format: date-time
 * 
 *     Pago:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         cotizacion_id:
 *           type: string
 *         cliente_id:
 *           type: string
 *         monto:
 *           type: number
 *         fecha:
 *           type: string
 *           format: date-time
 */

// ==============================================
// Operaciones CRUD básicas para cotizaciones
// ==============================================

/**
 * @swagger
 * /cotizaciones:
 *   get:
 *     summary: Obtener todas las cotizaciones
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Borrador, Enviada, Aprobada, Completada, Cancelada]
 *         description: Filtrar por estado
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [Contado, Financiado]
 *         description: Filtrar por tipo
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
 * /cotizaciones/{id}:
 *   get:
 *     summary: Obtener una cotización por ID
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cotización encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       404:
 *         description: Cotización no encontrada
 */
router.get('/:id', cotizacionController.obtenerCotizacionPorId);

/**
 * @swagger
 * /cotizaciones:
 *   post:
 *     summary: Crear una nueva cotización
 *     tags: [Cotizaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cotizacion'
 *           example:
 *             numero: "COT-2023-001"
 *             validoHasta: "2023-12-31"
 *             cliente: "64f1a2b3c4d5e6f7g8h9i0j"
 *             vendedor: "Raquel Solano Reyes"
 *             filial: "64f1a2b3c4d5e6f7g8h9i0k"
 *             tipo: "Financiado"
 *             items:
 *               - descripcion: "Cámara Domo 5 Mp"
 *                 cantidad: 2
 *                 precio: 1500
 *             financiamiento:
 *               anticipo: 2000
 *               plazo: 12
 *     responses:
 *       201:
 *         description: Cotización creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', cotizacionController.crearCotizacion);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   put:
 *     summary: Actualizar una cotización
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       404:
 *         description: Cotización no encontrada
 */
router.put('/:id', cotizacionController.actualizarCotizacion);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   delete:
 *     summary: Eliminar una cotización
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cotización eliminada
 *       404:
 *         description: Cotización no encontrada
 */
router.delete('/:id', cotizacionController.eliminarCotizacion);

// ==============================================
// Operaciones de Servicios
// ==============================================

/**
 * @swagger
 * /cotizaciones/{id}/activar:
 *   post:
 *     summary: Activar servicio asociado a cotización
 *     tags: [Cotizaciones]
 *     description: Convierte una cotización aprobada en un servicio activo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio activado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: No se puede activar el servicio
 *       404:
 *         description: Cotización no encontrada
 */
router.post('/:id/activar', cotizacionController.activarServicio);

/**
 * @swagger
 * /cotizaciones/{id}/completar:
 *   post:
 *     summary: Marcar servicio como completado
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio completado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: No se puede completar el servicio
 *       404:
 *         description: Cotización no encontrada
 */
router.post('/:id/completar', cotizacionController.completarServicio);

/**
 * @swagger
 * /cotizaciones/servicios/{estado}:
 *   get:
 *     summary: Obtener servicios por estado
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Pendiente, Activo, Completado, Cancelado]
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [Contado, Financiado]
 *         description: Filtrar por tipo de servicio
 *     responses:
 *       200:
 *         description: Lista de servicios
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
 * /cotizaciones/{id}/pagos:
 *   post:
 *     summary: Registrar pago para servicio financiado
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
 *             type: object
 *             properties:
 *               monto:
 *                 type: number
 *                 minimum: 1
 *             required:
 *               - monto
 *           example:
 *             monto: 1500
 *     responses:
 *       200:
 *         description: Pago registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cotizacion:
 *                   $ref: '#/components/schemas/Cotizacion'
 *                 pago:
 *                   $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Monto inválido o servicio no financiado
 *       404:
 *         description: Cotización no encontrada
 */
router.post('/:id/pagos', cotizacionController.registrarPago);

/**
 * @swagger
 * /cotizaciones/{id}/pagos:
 *   get:
 *     summary: Obtener historial de pagos de un servicio financiado
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Cotización no encontrada o no tiene pagos
 */
router.get('/:id/pagos', cotizacionController.obtenerHistorialPagos);

module.exports = router;