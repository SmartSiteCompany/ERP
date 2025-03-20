// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },  // <-- Agregado
  apellidos: { type: String, required: true }, // <-- Agregado
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_user', 'admin', 'user'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);