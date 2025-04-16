const mongoose = require('mongoose');
const Pago = require('../models/Pago');
const Cotizacion = require('../models/Cotizacion');
const { logError, logInfo } = require('../utils/loger');

class PaymentService {
  /**
   * Crea un nuevo registro de pago
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

      // Crear y guardar el pago
      const pago = new Pago({
        ...paymentData,
        fecha_pago: paymentData.fecha_pago || new Date(),
        estado: paymentData.estado || 'Completado'
      });

      await pago.save();
      
      // Actualizar referencia en cotización si es pago de contado
      if (paymentData.tipo_pago === 'Contado') {
        await Cotizacion.findByIdAndUpdate(
          paymentData.cotizacion_id,
          { pago_contado_id: pago._id }
        );
      }

      logInfo(`Pago creado exitosamente: ${pago._id}`);
      return pago;
    } catch (error) {
      logError('Error en PaymentService.createPayment', error);
      throw error;
    }
  }

  /**
   * Crea el pago inicial para una cotización financiada
   * @param {Cotizacion} cotizacion - Instancia de la cotización
   * @param {String} metodo_pago - Método de pago del anticipo
   * @returns {Promise<Pago>} - Pago de anticipo creado
   */
  static async createInitialPayment(cotizacion, metodo_pago) {
    try {
      if (!cotizacion.financiamiento) {
        throw new Error('La cotización no tiene financiamiento configurado');
      }

      const anticipo = cotizacion.financiamiento.anticipo_solicitado || 0;
      
      return await this.createPayment({
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion._id,
        monto_pago: anticipo,
        metodo_pago: metodo_pago,
        tipo_pago: 'Anticipo',
        saldo_pendiente: cotizacion.financiamiento.saldo_restante,
        referencia: `ANTICIPO-${cotizacion._id.toString().slice(-6)}`
      });
    } catch (error) {
      logError('Error en PaymentService.createInitialPayment', error);
      throw error;
    }
  }

  /**
   * Genera los pagos programados para un financiamiento
   * @param {String} cotizacionId - ID de la cotización
   * @returns {Promise<Array<Pago>>} - Pagos futuros creados
   */
  static async generateScheduledPayments(cotizacionId) {
    try {
      const cotizacion = await Cotizacion.findById(cotizacionId);
      if (!cotizacion || cotizacion.forma_pago !== 'Financiado') {
        throw new Error('Cotización financiada no encontrada');
      }

      const { plazo_semanas, pago_semanal } = cotizacion.financiamiento;
      const pagos = [];

      for (let i = 1; i <= plazo_semanas; i++) {
        pagos.push({
          cliente_id: cotizacion.cliente_id,
          cotizacion_id: cotizacion._id,
          monto_pago: pago_semanal,
          tipo_pago: 'Cuota',
          estado: 'Pendiente',
          fecha_estimada: new Date(Date.now() + 7 * i * 86400000), // +i semanas
          saldo_pendiente: pago_semanal * (plazo_semanas - i)
        });
      }

      const result = await Pago.insertMany(pagos);
      logInfo(`Generados ${result.length} pagos programados para cotización ${cotizacionId}`);
      return result;
    } catch (error) {
      logError('Error en PaymentService.generateScheduledPayments', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los pagos asociados a una cotización
   * @param {String} cotizacionId - ID de la cotización
   * @returns {Promise<Array<Pago>>} - Lista de pagos
   */
  static async getPaymentsByQuotation(cotizacionId) {
    try {
      return await Pago.find({ cotizacion_id: cotizacionId })
        .sort({ fecha_pago: -1, fecha_estimada: 1 });
    } catch (error) {
      logError('Error en PaymentService.getPaymentsByQuotation', error);
      throw error;
    }
  }

  /**
   * Elimina todos los pagos asociados a una cotización
   * @param {String} cotizacionId - ID de la cotización
   * @returns {Promise<Object>} - Resultado de la operación
   */
  static async deletePaymentsByQuotation(cotizacionId) {
    try {
      const result = await Pago.deleteMany({ cotizacion_id: cotizacionId });
      logInfo(`Eliminados ${result.deletedCount} pagos de cotización ${cotizacionId}`);
      return result;
    } catch (error) {
      logError('Error en PaymentService.deletePaymentsByQuotation', error);
      throw error;
    }
  }

  /**
   * Registra el pago de una cuota pendiente
   * @param {String} pagoId - ID del pago programado
   * @param {String} metodo_pago - Método de pago utilizado
   * @returns {Promise<Pago>} - Pago actualizado
   */
  static async payPendingPayment(pagoId, metodo_pago) {
    try {
      return await Pago.findByIdAndUpdate(
        pagoId,
        {
          estado: 'Completado',
          metodo_pago,
          fecha_pago: new Date()
        },
        { new: true }
      );
    } catch (error) {
      logError('Error en PaymentService.payPendingPayment', error);
      throw error;
    }
  }
}

module.exports = PaymentService;