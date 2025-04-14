const Pago = require('../models/Pago');
const { logError } = require('../utils/loger');

class PaymentService {
  /**
   * Crea un nuevo pago con validación robusta
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Pago>} - Instancia del pago creado
   */
  static async createPayment(paymentData) {
    try {
      // Validación de campos requeridos
      const requiredFields = [
        'cliente_id', 
        'cotizacion_id', 
        'monto_pago', 
        'metodo_pago',
        'tipo_pago'
      ];
      
      for (const field of requiredFields) {
        if (!paymentData[field]) {
          throw new Error(`Campo requerido faltante: ${field}`);
        }
      }

      // Calcular saldo pendiente si no se proporciona
      const saldo_pendiente = paymentData.saldo_pendiente ?? 
                             (paymentData.monto_pago * 0.8); // Ejemplo: 80% del monto

      // Crear el pago
      const pago = await Pago.create({
        ...paymentData,
        saldo_pendiente,
        fecha_pago: paymentData.fecha_pago || new Date(),
        estado: paymentData.estado || 'Completado'
      });

      return pago;
    } catch (error) {
      logError('Error en PaymentService.createPayment', error);
      throw error;
    }
  }

  /**
   * Crea un pago inicial para financiamiento (anticipo)
   */
  static async createInitialPayment(cotizacion, metodo_pago) {
    if (!cotizacion.financiamiento) {
      throw new Error('La cotización no tiene financiamiento');
    }

    return this.createPayment({
      cliente_id: cotizacion.cliente_id,
      cotizacion_id: cotizacion._id,
      monto_pago: cotizacion.financiamiento.anticipo_solicitado || 0,
      metodo_pago,
      tipo_pago: 'Anticipo',
      saldo_pendiente: cotizacion.financiamiento.saldo_restante
    });
  }
}

module.exports = PaymentService;