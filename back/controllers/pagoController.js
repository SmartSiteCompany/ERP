// src/controllers/estadoCuentaController.js
const Pago = require('../models/Pago');
const Cotizacion = require('../models/Cotizacion');
const EstadoCuenta = require('../models/EstadoCuenta');

// --- Funciones Auxiliares ---
const actualizarEstadoCuenta = async (cotizacion_id, pago_id, monto) => {
  await EstadoCuenta.findOneAndUpdate(
    { cotizacion_id },
    {
      $push: { pagos_ids: pago_id },
      $inc: { pagos_total: monto, saldo_actual: -monto },
      estado: 'Activo',
    },
    { upsert: true, new: true }
  );
};

// --- Controladores Principales ---

// Obtener todos los pagos (con filtros)
const obtenerPagos = async (req, res) => {
  try {
    const { cotizacion_id, cliente_id, tipo_pago, metodo_pago, fecha_inicio, fecha_fin } = req.query;
    const filtro = {};

    if (cotizacion_id) filtro.cotizacion_id = cotizacion_id;
    if (cliente_id) filtro.cliente_id = cliente_id;
    if (tipo_pago) filtro.tipo_pago = tipo_pago;
    if (metodo_pago) filtro.metodo_pago = metodo_pago;
    if (fecha_inicio || fecha_fin) {
      filtro.fecha_pago = {};
      if (fecha_inicio) filtro.fecha_pago.$gte = new Date(fecha_inicio);
      if (fecha_fin) filtro.fecha_pago.$lte = new Date(fecha_fin);
    }

    const pagos = await Pago.find(filtro)
      .populate('cliente_id', 'nombre email telefono')
      .populate('cotizacion_id', 'nombre_cotizacion precio_venta estado_servicio')
      .sort({ fecha_pago: -1 });

    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un pago (o el pago de contado de una cotización)
const obtenerPago = async (req, res) => {
  try {
    // Verificar si es una cotización con pago de contado
    const cotizacion = await Cotizacion.findById(req.params.id).populate('pago_contado_id');
    if (cotizacion?.pago_contado_id) {
      return res.json(cotizacion.pago_contado_id);
    }

    // Buscar como pago normal
    const pago = await Pago.findById(req.params.id)
      .populate('cliente_id', 'nombre email telefono direccion')
      .populate({
        path: 'cotizacion_id',
        select: 'nombre_cotizacion precio_venta estado_servicio forma_pago',
        populate: [
          { path: 'filial_id', select: 'nombre direccion' },
          { path: 'vendedor', select: 'nombre' }
        ]
      });

    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pagos financiados pendientes
const obtenerPagosFinanciados = async (req, res) => {
  try {
    const pagos = await Pago.find({
      cotizacion_id: req.params.cotizacion_id,
      tipo_pago: { $in: ['Abono', 'Anticipo'] },
      estado: 'Pendiente',
    }).sort({ fecha_estimada: 1 });

    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un pago individual (contado o abono)
const crearPago = async (req, res) => {
  try {
    const { cotizacion_id, monto_pago, metodo_pago, tipo_pago } = req.body;
    const cotizacion = await Cotizacion.findById(cotizacion_id);

    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const pago = new Pago({
      cliente_id: cotizacion.cliente_id,
      cotizacion_id,
      monto_pago,
      metodo_pago,
      tipo_pago: tipo_pago || (cotizacion.forma_pago === 'Contado' ? 'Contado' : 'Abono'),
      fecha_pago: new Date(),
    });

    await pago.save();
    await actualizarEstadoCuenta(cotizacion_id, pago._id, monto_pago);

    res.status(201).json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generar pagos futuros para financiamientos
const generarPagosFinanciados = async (cotizacion_id) => {
  const cotizacion = await Cotizacion.findById(cotizacion_id);
  if (cotizacion.forma_pago !== 'Financiado') return;

  const { plazo_semanas, pago_semanal } = cotizacion.financiamiento;
  const pagos = [];

  for (let i = 1; i <= plazo_semanas; i++) {
    pagos.push({
      cliente_id: cotizacion.cliente_id,
      cotizacion_id,
      monto_pago: pago_semanal,
      tipo_pago: 'Abono',
      estado: 'Pendiente',
      fecha_estimada: new Date(Date.now() + 7 * i * 86400000), // +i semanas
    });
  }

  await Pago.insertMany(pagos);
};

// Actualizar un pago existente
const actualizarPago = async (req, res) => {
  try {
    const { monto_pago, metodo_pago, observaciones } = req.body;
    const pago = await Pago.findByIdAndUpdate(
      req.params.id,
      { monto_pago, metodo_pago, observaciones },
      { new: true, runValidators: true }
    );

    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Recalcular saldo si el monto cambió
    if (monto_pago) {
      const cotizacion = await Cotizacion.findById(pago.cotizacion_id);
      if (cotizacion?.forma_pago === 'Financiado') {
        cotizacion.financiamiento.saldoRestante -= (monto_pago - pago.monto_pago);
        await cotizacion.save();
      }
    }

    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un pago
const eliminarPago = async (req, res) => {
  try {
    const pago = await Pago.findByIdAndDelete(req.params.id);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Actualizar EstadoCuenta
    await EstadoCuenta.findOneAndUpdate(
      { cotizacion_id: pago.cotizacion_id },
      { $pull: { pagos_ids: pago._id }, $inc: { pagos_total: -pago.monto_pago } }
    );

    res.json({ message: 'Pago eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Debitar un pago financiado pendiente
const debitarPagoFinanciado = async (req, res) => {
  try {
    const pago = await Pago.findByIdAndUpdate(
      req.params.pago_id,
      {
        metodo_pago: req.body.metodo_pago || 'Transferencia',
        fecha_pago: new Date(),
        estado: 'Completado',
      },
      { new: true }
    );

    if (!pago || pago.estado !== 'Pendiente') {
      return res.status(400).json({ error: 'Pago no disponible para debitar' });
    }

    // Actualizar saldo en cotización
    const cotizacion = await Cotizacion.findById(pago.cotizacion_id);
    cotizacion.financiamiento.saldoRestante -= pago.monto_pago;
    await cotizacion.save();

    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerPagos,
  obtenerPago,
  obtenerPagosFinanciados,
  crearPago,
  generarPagosFinanciados,
  actualizarPago,
  eliminarPago,
  debitarPagoFinanciado,
};