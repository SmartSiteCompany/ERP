const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API CRM & Cotizaciones',
      version: '1.0.0',
      description: 'Documentación completa del sistema',
    },
    components: {
      schemas: {
        // ==================== AUTENTICACIÓN ====================
        Usuario: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'María García' },
            email: { type: 'string', format: 'email', example: 'maria@empresa.com' },
            rol_user: { type: 'string', enum: ['admin', 'usuario', 'vendedor'], example: 'admin' },
            foto_user: { type: 'string', example: 'uploads/users/foto-maria.jpg' }
          }
        },

        PasswordReset: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'a1b2c3d4e5f6' },
            email: { type: 'string', example: 'maria@empresa.com' }
          }
        },

        // ==================== GESTIÓN DE CLIENTES ====================
        Cliente: {
          type: 'object',
          required: ['nombre', 'telefono', 'correo'],
          properties: {
            _id: { type: 'string', example: '611f1f77bcf86cd799433333' },
            nombre: { type: 'string', example: 'Carlos Méndez' },
            telefono: { type: 'string', example: '+525512345678' },
            correo: { type: 'string', format: 'email', example: 'carlos@cliente.com' }
          }
        },

        ChangeLog: {
          type: 'object',
          properties: {
            campo_modificado: { type: 'string', example: 'dirección' },
            valor_anterior: { type: 'string', example: 'Av. Reforma 123' },
            valor_nuevo: { type: 'string', example: 'Av. Insurgentes 456' }
          }
        },

        // ==================== VENTAS ====================
        Oportunidad: {
          type: 'object',
          properties: {
            valor_estimado: { type: 'number', example: 25000 },
            estado: { type: 'string', enum: ['en progreso', 'ganada', 'perdida'], example: 'en progreso' }
          }
        },

        // ==================== FINANZAS ====================
        EstadoCuenta: {
          type: 'object',
          properties: {
            saldo_actual: { type: 'number', example: 15000 },
            estado: { type: 'string', enum: ['Activo', 'Pagado', 'Vencido'], example: 'Activo' }
          }
        },

        Pago: {
          type: 'object',
          properties: {
            monto_pago: { type: 'number', example: 5000 },
            metodo_pago: { type: 'string', enum: ['Efectivo', 'Transferencia'], example: 'Transferencia' }
          }
        },

        // ==================== CRM ====================
        Feedback: {
          type: 'object',
          properties: {
            calificacion: { type: 'number', minimum: 1, maximum: 5, example: 4 },
            comentario: { type: 'string', example: 'Excelente servicio' }
          }
        },

        Nota: {
          type: 'object',
          properties: {
            titulo: { type: 'string', example: 'Recordar seguimiento' },
            contenido: { type: 'string', example: 'El cliente pidió cotización para ampliación' }
          }
        },

        // ==================== ERRORES ====================
        ErrorAPI: {
          type: 'object',
          properties: {
            codigo: { type: 'number', example: 404 },
            mensaje: { type: 'string', example: 'Recurso no encontrado' }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;