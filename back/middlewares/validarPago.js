const validarMonto = (req, res, next) => {
    if (req.body.monto_pago <= 0) {
      return res.status(400).json({ error: 'Monto debe ser mayor a cero' });
    }
    next();
  };
  
  const validarDatosPago = (req, res, next) => {
    const { cotizacion_id, monto_pago, metodo_pago } = req.body;
    if (!cotizacion_id || !monto_pago || !metodo_pago) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    next();
  };
  
  module.exports = { validarMonto, validarDatosPago };