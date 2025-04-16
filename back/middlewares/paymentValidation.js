const { body, validationResult } = require('express-validator');

exports.validatePaymentMethod = [
  body('forma_pago').isIn(['Contado', 'Financiado']),
  body('metodo_pago')
    .if(body('forma_pago').equals('Financiado'))
    .notEmpty()
    .withMessage('Método de pago es requerido para financiamiento')
    .isIn(['Efectivo', 'Transferencia', 'Tarjeta']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];