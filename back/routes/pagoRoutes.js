// src/routes/pagoRoutes.js
const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Endpoints para gestionar pagos de contado y financiados
 */

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Obtener todos los pagos con filtros avanzados
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: cotizacion_id
 *         schema:
 *           type: string
 *         description: Filtrar por ID de cotización específica
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: string
 *         description: Filtrar por ID de cliente específico
 *       - in: query
 *         name: tipo_pago
 *         schema:
 *           type: string
 *           enum: ['Contado', 'Financiado', 'Anticipo', 'Abono']
 *         description: Filtrar por tipo específico de pago
 *       - in: query
 *         name: metodo_pago
 *         schema:
 *           type: string
 *           enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque']
 *         description: Filtrar por método de pago específico
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial para rango (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final para rango (YYYY-MM-DD)
 *       - in: query
 *         name: min_monto
 *         schema:
 *           type: number
 *           minimum: 0.01
 *         description: Filtro por monto mínimo
 *       - in: query
 *         name: max_monto
 *         schema:
 *           type: number
 *           minimum: 0.01
 *         description: Filtro por monto máximo
 *     responses:
 *       200:
 *         description: Lista paginada de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 paginas:
 *                   type: integer
 *                   example: 2
 *                 resultados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Parámetros de filtrado inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', pagoController.obtenerPagos);

/**
 * @swagger
 * /pagos/{id}:
 *   get:
 *     summary: Obtener detalles completos de un pago específico
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Detalles completos del pago
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Pago'
 *                 - type: object
 *                   properties:
 *                     cotizacion:
 *                       $ref: '#/components/schemas/Cotizacion'
 *                     cliente:
 *                       $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Pago no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "No existe pago con el ID especificado"
 */
router.get('/:id', pagoController.obtenerPagoPorId);

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar un nuevo pago con actualización de saldos
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cotizacion_id:
 *                 type: string
 *                 description: ID de la cotización asociada (requerido)
 *               cliente_id:
 *                 type: string
 *                 description: ID del cliente (requerido)
 *               monto_pago:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Monto del pago (requerido)
 *               tipo_pago:
 *                 type: string
 *                 enum: ['Contado', 'Financiado', 'Anticipo', 'Abono']
 *                 description: Tipo de pago (requerido)
 *               metodo_pago:
 *                 type: string
 *                 enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque']
 *                 description: Método de pago (requerido)
 *               referencia:
 *                 type: string
 *                 description: Referencia/folio del pago
 *               observaciones:
 *                 type: string
 *                 description: Notas adicionales
 *             required:
 *               - cotizacion_id
 *               - cliente_id
 *               - monto_pago
 *               - tipo_pago
 *               - metodo_pago
 *           examples:
 *             abonoNormal:
 *               value:
 *                 cotizacion_id: "507f1f77bcf86cd799439011"
 *                 cliente_id: "507f191e810c19729de860ea"
 *                 monto_pago: 1500
 *                 tipo_pago: "Abono"
 *                 metodo_pago: "Transferencia"
 *                 referencia: "TRANS-789456"
 *             pagoContado:
 *               value:
 *                 cotizacion_id: "507f1f77bcf86cd799439012"
 *                 cliente_id: "507f191e810c19729de860eb"
 *                 monto_pago: 5000
 *                 tipo_pago: "Contado"
 *                 metodo_pago: "Efectivo"
 *     responses:
 *       201:
 *         description: Pago registrado con actualización de saldos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pago:
 *                   $ref: '#/components/schemas/Pago'
 *                 cotizacionActualizada:
 *                   $ref: '#/components/schemas/Cotizacion'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               montoInvalido:
 *                 value:
 *                   error: "El monto excede el saldo pendiente"
 *               estadoInvalido:
 *                 value:
 *                   error: "No se pueden registrar pagos en cotizaciones canceladas"
 *       404:
 *         description: Cotización no encontrada
 */
router.post('/', pagoController.crearPago);

/**
 * @swagger
 * /pagos/{id}:
 *   put:
 *     summary: Actualizar información de un pago existente
 *     tags: [Pagos]
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
 *                 description: Nuevo monto (solo incrementos permitidos)
 *               metodo_pago:
 *                 type: string
 *                 enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque']
 *               referencia:
 *                 type: string
 *               observaciones:
 *                 type: string
 *           example:
 *             metodo_pago: "Tarjeta"
 *             referencia: "TARJ-456123"
 *             observaciones: "Cambio de método de pago"
 *     responses:
 *       200:
 *         description: Pago actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Operación no permitida
 *         content:
 *           application/json:
 *             example:
 *               error: "No se puede reducir el monto de un pago registrado"
 *       404:
 *         description: Pago no encontrado
 */
router.put('/:id', pagoController.actualizarPago);

/**
 * @swagger
 * /pagos/{id}:
 *   delete:
 *     summary: Eliminar un pago (solo si es el más reciente)
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago eliminado y saldos reajustados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 saldoActualizado:
 *                   type: number
 *       403:
 *         description: Eliminación no permitida
 *         content:
 *           application/json:
 *             example:
 *               error: "Solo se puede eliminar el pago más reciente"
 *       404:
 *         description: Pago no encontrado
 */
router.delete('/:id', pagoController.eliminarPago);

module.exports = router;