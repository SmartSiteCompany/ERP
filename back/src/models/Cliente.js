const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre_cliente: { type: String, required: true },
  direccion_cliente: String,
  ciudad_estado_cliente: String,
  telefono_cliente: String,
  email_cliente: { type: String, unique: true, required: true },
  tier_cliente: { type: Number, enum: [1, 2, 3, 4], default: 4 } // Asigna Tier 4 por defecto
}, { timestamps: true });

module.exports = mongoose.model('Cliente', ClienteSchema);
