const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true }, // 🔹 Agregado índice
    password: { type: String, required: true },
    role: { type: String, enum: ['super_user', 'admin', 'user'], default: 'user' }
});

// 🔹 Prevenir re-hashing innecesario de la contraseña
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);
