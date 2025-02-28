// src/controllers/estadoCuentaController.js
const EstadoCuenta = require('../models/EstadoCuenta');
const Cliente = require('../models/Cliente');

exports.createOrUpdateEstadoCuenta = async (req, res) => {
  try {
    const { id_cliente, total_estado_cuenta, anticipo_estado_cuenta, cantidad_semanas, dia_pago, metodo_pago, recargo_impuntualidad } = req.body;

    // Verificar si el cliente existe
    const cliente = await Cliente.findById(id_cliente);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Calcular el restante
    const restante = total_estado_cuenta - anticipo_estado_cuenta;

    // Buscar si ya existe un estado de cuenta para este cliente
    let estadoCuenta = await EstadoCuenta.findOne({ id_cliente });

    if (estadoCuenta) {
      // Si existe, actualizarlo
      estadoCuenta.total_estado_cuenta = total_estado_cuenta;
      estadoCuenta.anticipo_estado_cuenta = anticipo_estado_cuenta;
      estadoCuenta.restante = restante;
      estadoCuenta.cantidad_semanas = cantidad_semanas;
      estadoCuenta.dia_pago = dia_pago;
      estadoCuenta.metodo_pago = metodo_pago;
      estadoCuenta.recargo_impuntualidad = recargo_impuntualidad;
    } else {
      // Si no existe, crearlo
      estadoCuenta = new EstadoCuenta({
        id_cliente,
        total_estado_cuenta,
        anticipo_estado_cuenta,
        restante,
        cantidad_semanas,
        dia_pago,
        metodo_pago,
        recargo_impuntualidad
      });
    }

    await estadoCuenta.save();
    res.status(201).json({ message: 'Estado de cuenta registrado/actualizado', estadoCuenta });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar estado de cuenta', details: error.message });
  }
};

exports.getEstadosCuenta = async (req, res) => {
  try {
    const estados = await EstadoCuenta.find().populate('id_cliente'); // 🔹 Trae info del cliente
    res.status(200).json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados de cuenta', details: error.message });
  }
};
