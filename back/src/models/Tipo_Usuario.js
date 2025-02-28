const mongoose = require('mongoose');

const TipoUsuarioSchema = new mongoose.Schema({
  tipo_usuario: { type: String, required: true, unique: true },
  lineas_verificentro: [String]
}, { timestamps: true });

module.exports = mongoose.model('TipoUsuario', TipoUsuarioSchema);
