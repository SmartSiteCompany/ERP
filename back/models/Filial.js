// src/models/Filial.js
const mongoose = require('mongoose');

const filialSchema = new mongoose.Schema({
  nombre_filial: { type: String, default: '' },
  cotizaciones: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Filial', filialSchema);