// src/routes/cotizacionRoutes.js
const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

/**
 * @swagger
 * /cotizaciones:
 *   get:
 *     summary: Obtener todas las cotizaciones con filtros avanzados
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: ['Borrador', 'Enviada', 'Aprobada', 'Completada', 'Cancelada']
 *         description: Filtro por estado de cotización
 *       - in: query
 *         name: estado_servicio
 *         schema:
 *           type: string
 *           enum: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado']
 *         description: Filtro por estado de servicio
 *       - in: query
 *         name: forma_pago
 *         schema:
 *           type: string
 *           enum: ['Contado', 'Financiado']
 *         description: Filtro por tipo de pago
 *       - in: query
 *         name: filial_id
 *         schema:
 *           type: string
 *         description: ID de filial para filtrar
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: string
 *         description: ID de cliente para filtrar
 *       - in: query
 *         name: vendedor
 *         schema:
 *           type: string
 *         description: Nombre del vendedor para filtrar
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial para rango de cotizaciones (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final para rango de cotizaciones (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de cotizaciones filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cotizacion'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 nombre_cotizacion: "Reparación de techos"
 *                 estado: "Aprobada"
 *                 estado_servicio: "En Proceso"
 *                 precio_venta: 25000
 */
router.get('/', cotizacionController.obtenerCotizaciones);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   get:
 *     summary: Obtener cotización por ID con relaciones completas
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
 *         description: Cotización con todos los campos y relaciones virtuales
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Cotizacion'
 *                 - type: object
 *                   properties:
 *                     cliente:
 *                       $ref: '#/components/schemas/Cliente'
 *                     filial:
 *                       $ref: '#/components/schemas/Filial'
 *                     pagos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Cotización no encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: "No se encontró cotización con el ID proporcionado"
 */
router.get('/:id', cotizacionController.obtenerCotizacionPorId);

/**
 * @swagger
 * /cotizaciones:
 *   post:
 *     summary: Crear nueva cotización con validación automática
 *     tags: [Cotizaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_cotizacion:
 *                 type: string
 *                 example: "Instalación de ventanas"
 *               validoHasta:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               forma_pago:
 *                 type: string
 *                 enum: ['Contado', 'Financiado']
 *               cliente_id:
 *                 type: string
 *                 example: "507f191e810c19729de860ea"
 *               filial_id:
 *                 type: string
 *                 example: "507f191e810c19729de860eb"
 *               vendedor:
 *                 type: string
 *                 example: "Juan Pérez"
 *               detalles:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   properties:
 *                     descripcion:
 *                       type: string
 *                     costo_materiales:
 *                       type: number
 *                     costo_mano_obra:
 *                       type: number
 *                     utilidad_esperada:
 *                       type: number
 *             required:
 *               - nombre_cotizacion
 *               - validoHasta
 *               - forma_pago
 *               - cliente_id
 *               - filial_id
 *               - vendedor
 *               - detalles
 *     responses:
 *       201:
 *         description: Cotización creada con cálculos automáticos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               error: "detalles: Debe contener al menos 1 item"
 */
router.post('/', cotizacionController.crearCotizacion);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   put:
 *     summary: Actualizar cotización existente con recálculo automático
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
 *         description: Cotización actualizada con recálculos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: Error en datos de entrada
 *       404:
 *         description: Cotización no encontrada
 *       409:
 *         description: No se puede modificar una cotización completada/cancelada
 */
router.put('/:id', cotizacionController.actualizarCotizacion);

/**
 * @swagger
 * /cotizaciones/{id}:
 *   delete:
 *     summary: Eliminar cotización (solo si está en estado Borrador)
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
 *         content:
 *           application/json:
 *             example:
 *               message: "Cotización eliminada correctamente"
 *       403:
 *         description: No se puede eliminar (estado no es Borrador)
 *         content:
 *           application/json:
 *             example:
 *               error: "Solo se pueden eliminar cotizaciones en estado Borrador"
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
 *     summary: Activar servicio cambiando estado a "En Proceso"
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio activado con fecha de inicio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: No se puede activar
 *         content:
 *           application/json:
 *             examples:
 *               financiamiento:
 *                 value:
 *                   error: "Requiere anticipo mínimo del 30% para activar"
 *               estado:
 *                 value:
 *                   error: "La cotización debe estar Aprobada para activar"
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
 *         description: Servicio completado con fecha de término
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: No se puede completar
 *         content:
 *           application/json:
 *             example:
 *               error: "El servicio no está en estado 'En Proceso'"
 *       404:
 *         description: Cotización no encontrada
 */
router.post('/:id/completar', cotizacionController.completarServicio);

/**
 * @swagger
 * /cotizaciones/servicios/{estado}:
 *   get:
 *     summary: Obtener servicios por estado con paginación
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado']
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista paginada de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cotizacion'
 */
router.get('/servicios/:estado', cotizacionController.obtenerServiciosPorEstado);

// ==============================================
// Operaciones de Pagos (para servicios financiados)
// ==============================================

/**
 * @swagger
 * /cotizaciones/{id}/pagos:
 *   post:
 *     summary: Registrar pago asociado a cotización
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
 *               monto_pago:
 *                 type: number
 *                 minimum: 0.01
 *               tipo_pago:
 *                 type: string
 *                 enum: ['Contado', 'Financiado', 'Anticipo', 'Abono']
 *               metodo_pago:
 *                 type: string
 *                 enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque']
 *               referencia:
 *                 type: string
 *             required:
 *               - monto_pago
 *               - tipo_pago
 *               - metodo_pago
 *     responses:
 *       200:
 *         description: Pago registrado y saldos actualizados
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
 *         description: Error en pago
 *         content:
 *           application/json:
 *             examples:
 *               monto:
 *                 value:
 *                   error: "El monto excede el saldo pendiente"
 *               estado:
 *                 value:
 *                   error: "No se pueden registrar pagos en cotizaciones canceladas"
 */
router.post('/:id/pagos', cotizacionController.registrarPago);

/**
 * @swagger
 * /cotizaciones/{id}/pagos:
 *   get:
 *     summary: Obtener historial completo de pagos
 *     tags: [Cotizaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: ['asc', 'desc']
 *           default: 'desc'
 *         description: Orden por fecha de pago
 *     responses:
 *       200:
 *         description: Lista de pagos ordenada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *       404:
 *         description: No se encontraron pagos
 */
router.get('/:id/pagos', cotizacionController.obtenerHistorialPagos);

module.exports = router;