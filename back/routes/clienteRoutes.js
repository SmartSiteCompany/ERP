const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para gestionar clientes.
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes.
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get('/', clienteController.obtenerClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por su ID.
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente.
 *     responses:
 *       200:
 *         description: Cliente obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado.
 */
router.post('/', clienteController.crearCliente);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente.
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *           example:
 *             nombre: "Juan Pérez"
 *             telefono: "555-1234"
 *             correo: "juan.perez@example.com"
 *             direccion: "Calle Falsa 123"
 *             tipo_cliente: "Individual"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *             example:
 *               _id: "64f1a2b3c4d5e6f7g8h9i0j"
 *               nombre: "Juan Pérez"
 *               telefono: "555-1234"
 *               correo: "juan.perez@example.com"
 *               direccion: "Calle Falsa 123"
 *               fecha_registro: "2023-10-01"
 *               estado_cliente: "Activo"
 *               tipo_cliente: "Individual"
 */
router.get('/:id', clienteController.obtenerClientePorId);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente existente.
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *           example:
 *             telefono: "555-5678"
 *             direccion: "Avenida Siempre Viva 456"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado.
 */
router.put('/:id', clienteController.actualizarCliente);
/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente.
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente.
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente.
 *       404:
 *         description: Cliente no encontrado.
 */
router.delete('/:id', clienteController.eliminarCliente);

module.exports = router;