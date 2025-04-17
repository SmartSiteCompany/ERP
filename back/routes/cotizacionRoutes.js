const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');
const { 
  validateCreatePayment,
  validateUpdatePayment,
  validateQueryPayments,
  validateDeletePayment
} = require('../middlewares/paymentValidation');
const { verificarCotizacion } = require('../controllers/cotizacionController');

/**
 * @swagger
 * tags:
 *   name: Cotizaciones
 *   description: Gestión completa de cotizaciones
 */

// ==============================================
// Operaciones CRUD Básicas
// ==============================================

/**
 * @swagger
 * /api/cotizaciones:
 *   get:
 *     summary: Obtener todas las cotizaciones (con filtros)
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Borrador, Enviada, Aprobada, Completada, Cancelada]
 *       - in: query
 *         name: forma_pago
 *         schema:
 *           type: string
 *           enum: [Contado, Financiado]
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
router.get('/', 
  validateQueryPayments, 
  cotizacionController.obtenerCotizaciones
);

/**
 * @swagger
 * /api/cotizaciones/{id}:
 *   get:
 *     summary: Obtener cotización por ID con detalles completos
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
 *               $ref: '#/components/schemas/CotizacionCompleta'
 *       404:
 *         description: Cotización no encontrada
 */
router.get('/:id', 
  verificarCotizacion,
  cotizacionController.obtenerCotizacionPorId
);

/**
 * @swagger
 * /api/cotizaciones:
 *   post:
 *     summary: Crear nueva cotización (con manejo de pagos automático)
 *     tags: [Cotizaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaCotizacion'
 *     responses:
 *       201:
 *         description: Cotización creada con pagos asociados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CotizacionCreada'
 *       400:
 *         description: Error de validación
 */
router.post('/',
  validateCreatePayment,
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
 *             $ref: '#/components/schemas/ActualizarCotizacion'
 *     responses:
 *       200:
 *         description: Cotización actualizada
 *       400:
 *         description: No se puede modificar una cotización completada
 */
router.put('/:id',
  verificarCotizacion,
  validateUpdatePayment,
  cotizacionController.actualizarCotizacion
);

/**
 * @swagger
 * /api/cotizaciones/{id}:
 *   delete:
 *     summary: Eliminar cotización (solo si está en estado Pendiente)
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
 *       400:
 *         description: No se puede eliminar cotización con servicios activos
 */
router.delete('/:id',
  verificarCotizacion,
  validateDeletePayment,
  cotizacionController.eliminarCotizacion
);

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
 *         description: Servicio activado con fechas actualizadas
 */
router.post('/:id/activar',
  verificarCotizacion,
  cotizacionController.activarServicio
);

/**
 * @swagger
 * /api/cotizaciones/{id}/completar:
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
 *         description: Servicio completado con éxito
 *       400:
 *         description: No se puede completar con saldo pendiente
 */
router.post('/:id/completar',
  verificarCotizacion,
  cotizacionController.completarServicio
);

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
 */
router.get('/servicios/:estado',
  cotizacionController.obtenerServiciosPorEstado
);

// ==============================================
// Operaciones de Pagos
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
 *             $ref: '#/components/schemas/NuevoPago'
 *     responses:
 *       201:
 *         description: Pago registrado y saldos actualizados
 */
router.post('/:id/pagos',
  verificarCotizacion,
  validateCreatePayment,
  cotizacionController.registrarPago
);

/**
 * @swagger
 * /api/cotizaciones/{id}/pagos:
 *   get:
 *     summary: Obtener historial de pagos de cotización
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de pagos con resumen
 */
router.get('/:id/pagos',
  verificarCotizacion,
  cotizacionController.obtenerHistorialPagos
);

module.exports = router;