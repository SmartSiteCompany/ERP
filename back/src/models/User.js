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

/*UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});*/

module.exports = mongoose.model('User', UserSchema);