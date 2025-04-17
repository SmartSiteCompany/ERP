// src/utils/constantes.js
module.exports = {
  // Estados de cotización
  estadosCotizacion: ['Borrador', 'Enviada', 'Aprobada', 'Completada', 'Cancelada'],
  
  // Estados de servicio
  estadosServicio: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'],
  
  // Formas de pago
  formasPago: ['Contado', 'Financiado'],
  
  // Tipos de pago financiado
  tiposPagoFinanciado: ['Anticipo', 'Abono', 'Intereses'],
  
  // Métodos de pago
  metodosPago: ['Efectivo', 'Transferencia', 'Tarjeta Débito', 'Tarjeta Crédito', 'Cheque'],
  
  // Tasas y constantes financieras
  tasas: {
    iva: 0.16,
    financiamiento: 0.34
  },

   // Tipos de pago
   tiposPago: ['Contado', 'Anticipo', 'Abono', 'Intereses', 'Mora'],

   // Estados de pago
   estadosPago: ['Pendiente', 'Completado', 'Cancelado', 'Reembolsado', 'Rechazado'],
 
   // Métodos de pago
   metodosPago: [
     'Efectivo', 
     'Transferencia', 
     'Tarjeta Débito', 
     'Tarjeta Crédito', 
     'Cheque',
     'Depósito'
   ],
 
   // Formatos de referencia
   formatosReferencia: {
     CONTADO: 'CONT-{id}',
     ANTICIPO: 'ANT-{id}',
     ABONO: 'ABO-{id}',
     INTERESES: 'INT-{id}'
   },

// Estados de estado de cuenta
estadosEstadoCuenta: [
  'Activo', 
  'En Mora', 
  'Liquidado', 
  'Cancelado', 
  'En Proceso'
],

// Tipos de movimiento
tiposMovimiento: [
  'Abono',
  'Intereses',
  'Ajuste',
  'Reembolso',
  'Cargo'
],

  // Configuración financiera
  configFinanciera: {
    IVA: 0.16,
    TASA_FINANCIAMIENTO: 0.34,
    DIAS_GRACIA: 5,
    INTERES_MORATORIO_DIARIO: 0.01
  }

};