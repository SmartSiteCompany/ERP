const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true }, // Asegurar que cada token sea único
    expiresAt: { type: Date, required: true, index: true } // Índice para mejorar rendimiento
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);

