const Pago = require('../models/Pago');
const Cotizacion = require('../models/Cotizacion');

// Obtener todos los pagos con filtros avanzados
const obtenerPagos = async (req, res) => {
  try {
    const { cotizacion_id, cliente_id, tipo_pago, metodo_pago, fecha_inicio, fecha_fin } = req.query;
    
    const filtro = {};
    if (cotizacion_id) filtro.cotizacion_id = cotizacion_id;
    if (cliente_id) filtro.cliente_id = cliente_id;
    if (tipo_pago) filtro.tipo_pago = tipo_pago;
    if (metodo_pago) filtro.metodo_pago = metodo_pago;
    
    // Filtro por rango de fechas
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
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener los pagos' 
    });
  }
};

// Obtener un pago por ID con información relacionada
const obtenerPagoPorId = async (req, res) => {
  try {
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
      return res.status(404).json({ 
        error: 'Pago no encontrado',
        message: 'El pago solicitado no existe en el sistema' 
      });
    }

    res.json(pago);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener el pago' 
    });
  }
};

// Obtener el pago de contado asociado a una cotización
const obtenerPagoContado = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id)
      .populate('pago_contado_id');
    
    if (!cotizacion || cotizacion.forma_pago !== 'Contado' || !cotizacion.pago_contado_id) {
      return res.status(404).json({
        error: 'Pago no encontrado',
        message: 'La cotización no es de contado o no tiene pago registrado'
      });
    }
    
    res.json(cotizacion.pago_contado_id);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener el pago de contado'
    });
  }
};

// Crear un nuevo pago con validaciones y actualización de cotización
const crearPago = async (req, res) => {
  try {
    const { cotizacion_id, monto_pago, tipo_pago, metodo_pago, referencia, observaciones } = req.body;

    // Validaciones básicas
    if (!cotizacion_id || !monto_pago || !metodo_pago) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'cotizacion_id, monto_pago y metodo_pago son requeridos'
      });
    }

    if (monto_pago <= 0) {
      return res.status(400).json({
        error: 'Monto inválido',
        message: 'El monto del pago debe ser mayor a cero'
      });
    }

    await EstadoCuenta.findOneAndUpdate(
      { cotizacion_id: pago.cotizacion_id },
      { 
        $push: { pagos_ids: pago._id },
        $inc: { pagos_total: pago.monto_pago, saldo_actual: -pago.monto_pago },
        estado: (pago.saldo_pendiente <= 0) ? 'Pagado' : 'Activo'
      },
      { new: true }
    )

    const cotizacion = await Cotizacion.findById(cotizacion_id);
    if (!cotizacion) {
      return res.status(404).json({
        error: 'Cotización no encontrada',
        message: 'La cotización asociada al pago no existe'
      });
    }

    // Calcular saldo pendiente
    let saldo_pendiente = 0;
    if (cotizacion.forma_pago === 'Financiado') {
      saldo_pendiente = (cotizacion.financiamiento?.saldoRestante || cotizacion.precio_venta) - monto_pago;
    } else {
      // Para pagos de contado
      const pagosPrevios = await Pago.find({ cotizacion_id });
      const totalPagado = pagosPrevios.reduce((sum, p) => sum + p.monto_pago, 0);
      saldo_pendiente = cotizacion.precio_venta - (totalPagado + monto_pago);
    }

    // Crear el pago
    const pago = new Pago({
      cliente_id: cotizacion.cliente_id,
      cotizacion_id,
      fecha_pago: new Date(),
      monto_pago,
      saldo_pendiente: Math.max(0, saldo_pendiente), // No permitir saldo negativo
      tipo_pago: tipo_pago || (cotizacion.forma_pago === 'Contado' ? 'Contado' : 'Abono'),
      metodo_pago,
      referencia,
      observaciones
    });

    await pago.save();

        // Sincronizar con EstadoCuenta
        const estadoCuenta = await EstadoCuenta.findOneAndUpdate(
          { cotizacion_id },
          { 
            $push: { pagos_ids: pago._id },
            $inc: { pagos_total: monto_pago },
          },
          { new: true, upsert: true } // Si no existe, lo crea
        ).populate('pago_id');

    // Actualizar la cotización si es financiado
    if (cotizacion.forma_pago === 'Financiado') {
      cotizacion.financiamiento.saldoRestante = Math.max(0, saldo_pendiente);
      
      if (saldo_pendiente <= 0) {
        cotizacion.estado_servicio = 'Completado';
        cotizacion.fecha_fin_servicio = new Date();
      }
      
      await cotizacion.save();
    }

    // Obtener el pago recién creado con datos poblados
    const pagoCreado = await Pago.findById(pago._id)
      .populate('cliente_id', 'nombre email')
      .populate('cotizacion_id', 'nombre_cotizacion precio_venta');

    res.status(201).json({
      message: 'Pago registrado exitosamente',
      pago: pagoCreado,
      saldo_pendiente: pago.saldo_pendiente
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al registrar el pago' 
    });
  }
};

// Actualizar un pago con validaciones
const actualizarPago = async (req, res) => {
  try {
    const { monto_pago, metodo_pago, observaciones } = req.body;

    // Validar que no se pueda cambiar datos críticos
    if (req.body.cotizacion_id || req.body.cliente_id || req.body.tipo_pago) {
      return res.status(400).json({
        error: 'Actualización no permitida',
        message: 'No se puede modificar cotizacion_id, cliente_id o tipo_pago'
      });
    }

    // Validar monto si viene en la actualización
    if (monto_pago && monto_pago <= 0) {
      return res.status(400).json({
        error: 'Monto inválido',
        message: 'El monto del pago debe ser mayor a cero'
      });
    }

    const pago = await Pago.findByIdAndUpdate(
      req.params.id,
      { 
        monto_pago,
        metodo_pago,
        observaciones,
        updatedAt: new Date() 
      },
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate('cliente_id', 'nombre email')
    .populate('cotizacion_id', 'nombre_cotizacion precio_venta');

    if (!pago) {
      return res.status(404).json({ 
        error: 'Pago no encontrado',
        message: 'El pago que intentas actualizar no existe' 
      });
    }

    // Recalcular saldos si se actualizó el monto
    if (monto_pago) {
      const cotizacion = await Cotizacion.findById(pago.cotizacion_id);
      if (cotizacion && cotizacion.forma_pago === 'Financiado') {
        const otrosPagos = await Pago.find({ 
          cotizacion_id: pago.cotizacion_id,
          _id: { $ne: pago._id }
        });
        
        const totalOtrosPagos = otrosPagos.reduce((sum, p) => sum + p.monto_pago, 0);
        const nuevoSaldo = cotizacion.precio_venta - (totalOtrosPagos + pago.monto_pago);
        
        cotizacion.financiamiento.saldoRestante = Math.max(0, nuevoSaldo);
        await cotizacion.save();
        
        // Actualizar también el saldo en el pago
        pago.saldo_pendiente = Math.max(0, nuevoSaldo);
        await pago.save();
      }
    }

    res.json({
      message: 'Pago actualizado exitosamente',
      pago
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al actualizar el pago' 
    });
  }
};

// Eliminar un pago con validaciones
const eliminarPago = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id);
    if (!pago) {
      return res.status(404).json({ 
        error: 'Pago no encontrado',
        message: 'El pago que intentas eliminar no existe' 
      });
    }

        // Restar el monto del EstadoCuenta
        await EstadoCuenta.findOneAndUpdate(
          { cotizacion_id: pago.cotizacion_id },
          { 
            $pull: { pagos_ids: pago._id },
            $inc: { pagos_total: -pago.monto_pago },
          }
        );
    

    // Verificar si la cotización asociada existe
    const cotizacion = await Cotizacion.findById(pago.cotizacion_id);
    if (!cotizacion) {
      return res.status(400).json({
        error: 'Cotización no encontrada',
        message: 'No se puede eliminar el pago porque la cotización asociada no existe'
      });
    }



    // Eliminar el pago
    await Pago.findByIdAndDelete(req.params.id);

    // Recalcular saldos si era financiado
    if (cotizacion.forma_pago === 'Financiado') {
      const pagosRestantes = await Pago.find({ cotizacion_id: pago.cotizacion_id });
      const totalPagado = pagosRestantes.reduce((sum, p) => sum + p.monto_pago, 0);
      
      cotizacion.financiamiento.saldoRestante = cotizacion.precio_venta - totalPagado;
      
      // Si no hay pagos restantes y estaba completado, cambiar estado
      if (pagosRestantes.length === 0 && cotizacion.estado_servicio === 'Completado') {
        cotizacion.estado_servicio = 'EnProceso';
        cotizacion.fecha_fin_servicio = undefined;
      }
      
      await cotizacion.save();
    }

    res.json({ 
      message: 'Pago eliminado correctamente',
      cotizacion_id: pago.cotizacion_id,
      saldo_restante: cotizacion.forma_pago === 'Financiado' 
        ? cotizacion.financiamiento.saldoRestante 
        : null
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al eliminar el pago' 
    });
  }
};

module.exports = {
  obtenerPagos,
  obtenerPagoPorId,
  obtenerPagoContado,
  crearPago,
  actualizarPago,
  eliminarPago
};