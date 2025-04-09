const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

/**
 * @swagger
 * tags:
 *   name: Cotizaciones
 *   description: Endpoints para gestionar cotizaciones y servicios financiados
 * 
 * components:
 *   schemas:
 *     Cotizacion:
 *       type: object
 *       required:
 *         - nombre_cotizacion
 *         - fecha_cotizacion
 *         - forma_pago
 *         - filial_id
 *         - cliente_id
 *         - detalles
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la cotización
 *         nombre_cotizacion:
 *           type: string
 *           description: Nombre de la cotización
 *         fecha_cotizacion:
 *           type: string
 *           format: date
 *           description: Fecha de creación
 *         forma_pago:
 *           type: string
 *           enum: ["Contado", "Financiado"]
 *           description: Tipo de pago
 *         precio_venta:
 *           type: number
 *           readOnly: true
 *           description: Precio total del servicio (calculado automáticamente)
 *         anticipo_solicitado:
 *           type: number
 *           minimum: 0
 *           description: Anticipo requerido (solo financiado)
 *         filial_id:
 *           type: string
 *           description: ID de la filial asociada
 *         cliente_id:
 *           type: string
 *           description: ID del cliente asociado
 *         estado_servicio:
 *           type: string
 *           enum: ["Pendiente", "Activo", "Completado", "Cancelado"]
 *           default: "Pendiente"
 *           description: Estado del servicio generado
 *         detalles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               descripcion: { type: "string" }
 *               costo_materiales: { type: "number", minimum: 0 }
 *               costo_mano_obra: { type: "number", minimum: 0 }
 *               inversion: { type: "number", readOnly: true }
 *               utilidad_esperada: { type: "number", minimum: 0 }
 *             required:
 *               - descripcion
 *               - costo_materiales
 *               - costo_mano_obra
 *         financiamiento:
 *           type: object
 *           properties:
 *             plazo_semanas:
 *               type: integer
 *               minimum: 1
 *               description: Plazo en semanas
 *             pago_semanal:
 *               type: number
 *               readOnly: true
 *               description: Monto de pago semanal calculado
 *             saldo_restante:
 *               type: number
 *               readOnly: true
 *               description: Saldo pendiente de pago
 *             fecha_inicio:
 *               type: string
 *               format: date
 *               description: Fecha de inicio del servicio
 *             fecha_termino:
 *               type: string
 *               format: date
 *               description: Fecha estimada de término
 *         pagos:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Pago"
 * 
 *     Pago:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del pago
 *         cotizacion_id:
 *           type: string
 *           description: ID de la cotización asociada
 *         cliente_id:
 *           type: string
 *           description: ID del cliente
 *         monto:
 *           type: number
 *           minimum: 0.01
 *           description: Monto del pago
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del pago
 *         metodo_pago:
 *           type: string
 *           enum: ["Efectivo", "Transferencia", "Tarjeta"]
 *           description: Método de pago utilizado
 *       required:
 *         - cotizacion_id
 *         - cliente_id
 *         - monto
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
 *           enum: ["Pendiente", "Activo", "Completado", "Cancelado"]
 *         description: Filtrar por estado de servicio
 *       - in: query
 *         name: forma_pago
 *         schema:
 *           type: string
 *           enum: ["Contado", "Financiado"]
 *         description: Filtrar por tipo de pago
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
 *             nombre_cotizacion: "Instalación sistema seguridad"
 *             forma_pago: "Financiado"
 *             filial_id: "64f1a2b3c4d5e6f7g8h9i0k"
 *             cliente_id: "64f1a2b3c4d5e6f7g8h9i0j"
 *             anticipo_solicitado: 2000
 *             detalles:
 *               - descripcion: "Cámara de vigilancia 4K"
 *                 costo_materiales: 1200
 *                 costo_mano_obra: 500
 *                 utilidad_esperada: 30
 *             financiamiento:
 *               plazo_semanas: 12
 *     responses:
 *       201:
 *         description: Cotización creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/', cotizacionController.crearCotizacion);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   put:
 *     summary: Actualizar una cotización existente
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
 *         description: Cotización actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       404:
 *         description: Cotización no encontrada
 *       400:
 *         description: Datos de entrada inválidos
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
 *         description: Cotización eliminada exitosamente
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
 *     description: Convierte una cotización en un servicio activo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio activado exitosamente
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
 *         description: Servicio marcado como completado
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
 *           enum: ["Pendiente", "Activo", "Completado", "Cancelado"]
 *       - in: query
 *         name: forma_pago
 *         schema:
 *           type: string
 *           enum: ["Contado", "Financiado"]
 *         description: Filtrar por tipo de pago
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
 *                 minimum: 0.01
 *               metodo_pago:
 *                 type: string
 *                 enum: ["Efectivo", "Transferencia", "Tarjeta"]
 *             required:
 *               - monto
 *           example:
 *             monto: 1500
 *             metodo_pago: "Transferencia"
 *     responses:
 *       200:
 *         description: Pago registrado exitosamente
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
 *         description: Lista de pagos registrados
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