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

module.exports = router;