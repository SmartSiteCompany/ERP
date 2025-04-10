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
            nombre_filial: { 
              type: "string",
              description: "Nombre de la filial",
              example: "DataX"
            },
            descripcion_filial: { 
              type: "string",
              description: "Descripción de la filial",
              example: "Sucursal de desarrollo de software"
            }
          },
          required: ["nombre_filial", "descripcion_filial"]
        },
        
        // FilialResponse (para respuestas GET que incluyen el ID)
        FilialResponse: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID único de la filial",
              example: "507f1f77bcf86cd799439011"
            },
            nombre_filial: { 
              type: "string",
              description: "Nombre de la filial"
            },
            descripcion_filial: { 
              type: "string",
              description: "Descripción de la filial"
            }
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
              description: "ID único generado automáticamente",
              example: "507f1f77bcf86cd799439011"
            },
            cotizacion_id: {
              type: "string",
              description: "ID de la cotización relacionada (ObjectId)",
              example: "507f191e810c19729de860ea"
            },
            cliente_id: {
              type: "string",
              description: "ID del cliente (ObjectId)",
              example: "507f191e810c19729de860eb"
            },
            fecha_pago: {
              type: "string",
              format: "date-time",
              description: "Fecha y hora del pago (generada automáticamente)",
              example: "2023-10-20T14:30:00Z"
            },
            monto_pago: {
              type: "number",
              minimum: 0.01,
              description: "Monto del pago en moneda local",
              example: 1500.50
            },
            saldo_pendiente: {
              type: "number",
              description: "Saldo restante después de este pago (calculado automáticamente)",
              example: 3500.00
            },
            tipo_pago: {
              type: "string",
              enum: ["Contado", "Financiado", "Anticipo", "Abono"],
              description: "Clasificación del tipo de pago",
              example: "Abono"
            },
            metodo_pago: {
              type: "string",
              enum: ["Efectivo", "Transferencia", "Tarjeta", "Cheque"],
              description: "Medio utilizado para el pago",
              example: "Transferencia"
            },
            referencia: {
              type: "string",
              description: "Identificador único proporcionado por el medio de pago",
              example: "TRANS-789456"
            },
            observaciones: {
              type: "string",
              description: "Notas adicionales sobre el pago",
              example: "Pago correspondiente a la semana 3"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación del registro",
              readOnly: true
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
              readOnly: true
            }
          },
          required: [
            "cotizacion_id",
            "cliente_id",
            "monto_pago",
            "tipo_pago",
            "metodo_pago"
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
              description: "Nombre descriptivo de la cotización",
              example: "Instalación eléctrica residencial"
            },
            fecha_cotizacion: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación automática",
              default: "Fecha actual"
            },
            validoHasta: {
              type: "string",
              format: "date-time",
              description: "Fecha de validez de la cotización",
              example: "2023-12-31T23:59:59Z"
            },
            estado: {
              type: "string",
              enum: ["Borrador", "Enviada", "Aprobada", "Completada", "Cancelada"],
              default: "Borrador",
              description: "Estado del flujo de cotización"
            },
            cliente_id: {
              type: "string",
              description: "ID del cliente asociado (ObjectId)"
            },
            vendedor: {
              type: "string",
              description: "Nombre del vendedor responsable",
              example: "María González"
            },
            filial_id: {
              type: "string",
              description: "ID de la filial/sucursal asociada (ObjectId)"
            },
            detalles: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                properties: {
                  descripcion: {
                    type: "string",
                    description: "Descripción del servicio/producto",
                    example: "Cámara de seguridad 4K"
                  },
                  costo_materiales: {
                    type: "number",
                    minimum: 0,
                    description: "Costo de materiales",
                    example: 1200
                  },
                  costo_mano_obra: {
                    type: "number",
                    minimum: 0,
                    description: "Costo de mano de obra",
                    example: 800
                  },
                  utilidad_esperada: {
                    type: "number",
                    default: 0,
                    description: "Porcentaje de utilidad esperada",
                    example: 30
                  },
                  inversion: {
                    type: "number",
                    readOnly: true,
                    description: "Total calculado (materiales + mano obra)",
                    example: 2000
                  }
                },
                required: ["descripcion", "costo_materiales", "costo_mano_obra"]
              }
            },
            subtotal: {
              type: "number",
              readOnly: true,
              description: "Subtotal antes de impuestos (calculado automáticamente)",
              example: 15000
            },
            iva: {
              type: "number",
              readOnly: true,
              description: "Monto de IVA calculado (19%)",
              example: 2850
            },
            precio_venta: {
              type: "number",
              readOnly: true,
              description: "Precio total con utilidad e impuestos",
              example: 17850
            },
            forma_pago: {
              type: "string",
              enum: ["Contado", "Financiado"],
              description: "Tipo de pago/contrato"
            },
            pago_contado_id: {
              type: "string",
              description: "ID del pago completo (solo para forma_pago=Contado)"
            },
            financiamiento: {
              type: "object",
              properties: {
                anticipo_solicitado: {
                  type: "number",
                  minimum: 0,
                  description: "Anticipo requerido",
                  example: 5000
                },
                plazo_semanas: {
                  type: "number",
                  minimum: 1,
                  description: "Plazo en semanas",
                  example: 12
                },
                pago_semanal: {
                  type: "number",
                  readOnly: true,
                  description: "Monto de pago semanal calculado",
                  example: 1070.83
                },
                saldo_restante: {
                  type: "number",
                  readOnly: true,
                  description: "Saldo pendiente calculado",
                  example: 12850
                },
                fecha_inicio: {
                  type: "string",
                  format: "date-time",
                  description: "Fecha de inicio del servicio"
                },
                fecha_termino: {
                  type: "string",
                  format: "date-time",
                  description: "Fecha estimada de término (calculada automáticamente)"
                }
              }
            },
            estado_servicio: {
              type: "string",
              enum: ["Pendiente", "En Proceso", "Completado", "Cancelado"],
              default: "Pendiente",
              description: "Estado del servicio asociado"
            },
            fecha_inicio_servicio: {
              type: "string",
              format: "date-time",
              description: "Fecha real de inicio del servicio"
            },
            fecha_fin_servicio: {
              type: "string",
              format: "date-time",
              description: "Fecha real de finalización del servicio"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              readOnly: true,
              description: "Fecha de creación del registro"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              readOnly: true,
              description: "Fecha de última actualización"
            }
          },
          required: [
            "nombre_cotizacion",
            "validoHasta",
            "forma_pago",
            "cliente_id",
            "vendedor",
            "filial_id",
            "detalles"
          ]
        },
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
              description: "Fecha y hora del pago",
              default: "Fecha actual"
            },
            monto_pago: {
              type: "number",
              minimum: 0.01,
              description: "Monto del pago",
              example: 1500
            },
            saldo_pendiente: {
              type: "number",
              description: "Saldo restante después de este pago",
              example: 11350
            },
            tipo_pago: {
              type: "string",
              enum: ["Contado", "Financiado", "Anticipo", "Abono"],
              description: "Tipo de transacción"
            },
            metodo_pago: {
              type: "string",
              enum: ["Efectivo", "Transferencia", "Tarjeta", "Cheque"],
              description: "Método de pago utilizado"
            },
            referencia: {
              type: "string",
              description: "Número de referencia/folio del pago",
              example: "TRANS-12345"
            },
            observaciones: {
              type: "string",
              description: "Notas adicionales sobre el pago",
              example: "Pago parcial mediante transferencia"
            }
          },
          required: [
            "cotizacion_id",
            "cliente_id",
            "monto_pago",
            "tipo_pago",
            "metodo_pago"
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