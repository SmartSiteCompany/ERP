// Configuración de Swagger
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentación de la API para el sistema de gestión de clientes y filiales."
    },
    servers: [{ url: "http://localhost:8000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        // Usuario
        User: {
          type: "object",
          properties: {
            name: { type: "string" },
            apellidos: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            area: { type: "string" }
          }
        },
        
        // Filial
        Filial: {
          type: "object",
          properties: {
            nombre_filial: { type: "string" },
            descripcion_filial: { type: "string" }
          }
        },
        
        // Password Reset
        PasswordReset: {
          type: "object",
          properties: {
            email: { type: "string" },
            token: { type: "string" }
          }
        },
        
        // Pago (actualizado para referenciar cotización en lugar de servicio)
        Pago: {
          type: "object",
          properties: {
            _id: { 
              type: "string", 
              description: "ID único del pago" 
            },
            cotizacion_id: { 
              type: "string", 
              description: "ID de la cotización asociada" 
            },
            cliente_id: { 
              type: "string", 
              description: "ID del cliente" 
            },
            fecha_pago: { 
              type: "string", 
              format: "date-time", 
              description: "Fecha del pago" 
            },
            monto: { 
              type: "number", 
              minimum: 0,
              description: "Monto del pago" 
            },
            metodo: {
              type: "string",
              enum: ["Efectivo", "Transferencia", "Tarjeta"],
              description: "Método de pago"
            },
            referencia: {
              type: "string",
              description: "Referencia/folio del pago"
            },
            saldo_anterior: {
              type: "number",
              description: "Saldo antes del pago"
            },
            saldo_actual: {
              type: "number",
              description: "Saldo después del pago"
            }
          },
          required: [
            "cotizacion_id",
            "cliente_id",
            "monto",
            "metodo"
          ]
        },
        
        // Estado de cuenta
        EstadoCuenta: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID único del estado de cuenta."
            },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado al estado de cuenta."
            },
            servicio_id: {
              type: "string",
              description: "ID del servicio asociado al estado de cuenta."
            },
            fecha_estado: {
              type: "string",
              format: "date",
              description: "Fecha del estado de cuenta."
            },
            saldo_inicial: {
              type: "number",
              description: "Saldo inicial del estado de cuenta."
            },
            pago_total: {
              type: "number",
              description: "Total de pagos realizados."
            },
            saldo_actual: {
              type: "number",
              description: "Saldo actual después de los pagos."
            },
            pago_semanal: {
              type: "number",
              description: "Monto del pago semanal."
            },
            total_a_pagar: {
              type: "number",
              description: "Total a pagar por el servicio."
            }
          },
          required: [
            "cliente_id",
            "servicio_id",
            "fecha_estado",
            "saldo_inicial",
            "pago_total",
            "saldo_actual",
            "pago_semanal",
            "total_a_pagar"
          ]
        },
        
        // Cotización (actualizada para incluir servicio financiado)
        Cotizacion: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID único de la cotización"
            },
            nombre_cotizacion: {
              type: "string",
              description: "Nombre de la cotización"
            },
            fecha_cotizacion: {
              type: "string",
              format: "date",
              description: "Fecha de creación"
            },
            forma_pago: {
              type: "string",
              enum: ["Contado", "Financiado"],
              description: "Tipo de pago"
            },
            precio_venta: {
              type: "number",
              description: "Precio total del servicio"
            },
            anticipo_solicitado: {
              type: "number",
              description: "Anticipo requerido (solo financiado)"
            },
            filial_id: {
              type: "string",
              description: "ID de la filial asociada"
            },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado"
            },
            estado_servicio: {
              type: "string",
              enum: ["Pendiente", "Activo", "Completado", "Cancelado"],
              description: "Estado del servicio generado"
            },
            detalles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  descripcion: { type: "string" },
                  costo_materiales: { type: "number" },
                  costo_mano_obra: { type: "number" },
                  inversion: { type: "number" },
                  utilidad_esperada: { type: "number" }
                }
              }
            },
            // Campos específicos para servicios financiados
            financiamiento: {
              type: "object",
              properties: {
                plazo_semanas: {
                  type: "integer",
                  description: "Plazo en semanas"
                },
                pago_semanal: {
                  type: "number",
                  description: "Monto de pago semanal calculado"
                },
                saldo_restante: {
                  type: "number",
                  description: "Saldo pendiente de pago"
                },
                fecha_inicio: {
                  type: "string",
                  format: "date",
                  description: "Fecha de inicio del servicio"
                },
                fecha_termino: {
                  type: "string",
                  format: "date",
                  description: "Fecha estimada de término"
                }
              }
            },
            // Campos para pagos registrados
            pagos: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Pago"
              }
            }
          },
          required: [
            "nombre_cotizacion",
            "fecha_cotizacion",
            "forma_pago",
            "precio_venta",
            "filial_id",
            "cliente_id",
            "detalles"
          ]
        },
        
        // Cliente
        Cliente: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único del cliente." },
            nombre: { type: "string", description: "Nombre del cliente." },
            telefono: { type: "string", description: "Teléfono del cliente." },
            correo: {
              type: "string",
              description: "Correo electrónico del cliente."
            },
            direccion: {
              type: "string",
              description: "Dirección del cliente."
            },
            fecha_registro: {
              type: "string",
              format: "date",
              description: "Fecha de registro del cliente."
            },
            estado_cliente: {
              type: "string",
              enum: ["Activo", "Inactivo"],
              description: "Estado del cliente."
            },
            tipo_cliente: {
              type: "string",
              enum: ["Individual", "Empresa"],
              description: "Tipo de cliente."
            }
          },
          required: [
            "nombre",
            "telefono",
            "correo",
            "direccion",
            "estado_cliente",
            "tipo_cliente"
          ]
        },
        
        // ChangeLog
        ChangeLog: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID único del registro de cambio."
            },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado al cambio."
            },
            campo_modificado: {
              type: "string",
              description: "Campo que fue modificado."
            },
            valor_anterior: {
              type: "string",
              description: "Valor anterior del campo."
            },
            valor_nuevo: {
              type: "string",
              description: "Nuevo valor del campo."
            },
            fecha_cambio: {
              type: "string",
              format: "date",
              description: "Fecha en que se realizó el cambio."
            },
            responsable: {
              type: "string",
              description: "Persona responsable del cambio."
            }
          },
          required: [
            "cliente_id",
            "campo_modificado",
            "valor_anterior",
            "valor_nuevo",
            "responsable"
          ]
        },
        
        Campana: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único de la campaña." },
            nombre: { type: "string", description: "Nombre de la campaña." },
            descripcion: {
              type: "string",
              description: "Descripción de la campaña."
            },
            fecha_inicio: {
              type: "string",
              format: "date",
              description: "Fecha de inicio de la campaña."
            },
            fecha_fin: {
              type: "string",
              format: "date",
              description: "Fecha de fin de la campaña."
            },
            estado: {
              type: "string",
              enum: ["activa", "inactiva", "completada"],
              description: "Estado de la campaña."
            },
            clientes: {
              type: "array",
              items: { type: "string" },
              description: "IDs de los clientes asociados a la campaña."
            }
          },
          required: [
            "nombre",
            "descripcion",
            "fecha_inicio",
            "fecha_fin",
            "estado"
          ]
        },
        
        // Documento
        Documento: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único del documento." },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado al documento."
            },
            nombre: { type: "string", description: "Nombre del documento." },
            tipo: {
              type: "string",
              enum: ["contrato", "factura", "propuesta", "otro"],
              description: "Tipo de documento."
            },
            fecha_subida: {
              type: "string",
              format: "date",
              description: "Fecha de subida del documento."
            },
            archivo: {
              type: "string",
              description: "URL o referencia al archivo."
            }
          },
          required: ["cliente_id", "nombre", "tipo", "archivo"]
        },
        
        // Evento
        Evento: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único del evento." },
            nombre: { type: "string", description: "Nombre del evento." },
            descripcion: {
              type: "string",
              description: "Descripción del evento."
            },
            fecha: {
              type: "string",
              format: "date",
              description: "Fecha del evento."
            },
            ubicacion: { type: "string", description: "Ubicación del evento." },
            clientes: {
              type: "array",
              items: { type: "string" },
              description: "IDs de los clientes asociados al evento."
            }
          },
          required: ["nombre", "descripcion", "fecha", "ubicacion"]
        },
        
        // Feedback
        Feedback: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único del feedback." },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado al feedback."
            },
            comentario: {
              type: "string",
              description: "Comentario del feedback."
            },
            fecha: {
              type: "string",
              format: "date",
              description: "Fecha del feedback."
            },
            calificacion: {
              type: "number",
              minimum: 1,
              maximum: 5,
              description: "Calificación del feedback (1-5)."
            }
          },
          required: ["cliente_id", "comentario", "calificacion"]
        },
        
        // Interacción
        Interaccion: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único de la interacción." },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado a la interacción."
            },
            tipo_interaccion: {
              type: "string",
              enum: ["llamada", "correo", "reunión", "visita"],
              description: "Tipo de interacción."
            },
            fecha: {
              type: "string",
              format: "date",
              description: "Fecha de la interacción."
            },
            descripcion: {
              type: "string",
              description: "Descripción de la interacción."
            },
            responsable: {
              type: "string",
              description: "Persona responsable de la interacción."
            },
            estado: {
              type: "string",
              enum: ["pendiente", "completada", "cancelada"],
              description: "Estado de la interacción."
            }
          },
          required: [
            "cliente_id",
            "tipo_interaccion",
            "descripcion",
            "responsable"
          ]
        },
        
        // Nota
        Nota: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único de la nota." },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado a la nota."
            },
            contenido: { type: "string", description: "Contenido de la nota." },
            fecha_creacion: {
              type: "string",
              format: "date",
              description: "Fecha de creación de la nota."
            },
            autor: { type: "string", description: "Autor de la nota." }
          },
          required: ["cliente_id", "contenido", "autor"]
        },
        
        // Oportunidad
        Oportunidad: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único de la oportunidad." },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado a la oportunidad."
            },
            descripcion: {
              type: "string",
              description: "Descripción de la oportunidad."
            },
            valor_estimado: {
              type: "number",
              description: "Valor estimado de la oportunidad."
            },
            fecha_cierre_estimada: {
              type: "string",
              format: "date",
              description: "Fecha de cierre estimada de la oportunidad."
            },
            estado: {
              type: "string",
              enum: ["en progreso", "ganada", "perdida"],
              description: "Estado de la oportunidad."
            },
            responsable: {
              type: "string",
              description: "Persona responsable de la oportunidad."
            }
          },
          required: [
            "cliente_id",
            "descripcion",
            "valor_estimado",
            "fecha_cierre_estimada",
            "responsable"
          ]
        },
        
        // Segmentacion
        Segmentacion: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID único de la segmentación."
            },
            nombre: {
              type: "string",
              description: "Nombre de la segmentación."
            },
            descripcion: {
              type: "string",
              description: "Descripción de la segmentación."
            },
            criterios: {
              type: "string",
              description: "Criterios de segmentación."
            },
            clientes: {
              type: "array",
              items: { type: "string" },
              description: "IDs de los clientes asociados a la segmentación."
            }
          },
          required: ["nombre", "descripcion", "criterios"]
        },
        
        // Tarea
        Tarea: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único de la tarea." },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado a la tarea."
            },
            descripcion: {
              type: "string",
              description: "Descripción de la tarea."
            },
            fecha_vencimiento: {
              type: "string",
              format: "date",
              description: "Fecha de vencimiento de la tarea."
            },
            estado: {
              type: "string",
              enum: ["pendiente", "en progreso", "completada"],
              description: "Estado de la tarea."
            },
            responsable: {
              type: "string",
              description: "Persona responsable de la tarea."
            }
          },
          required: [
            "cliente_id",
            "descripcion",
            "fecha_vencimiento",
            "responsable"
          ]
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;