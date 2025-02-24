// app.js
const express = require('express');
require('dotenv').config();
console.log('🔹 MONGO_URI:', process.env.MONGO_URI); // <-- Agregado aquí
console.log('🔹 ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'OK' : 'NO DEFINIDO'); // <-- Agregado aquí
console.log('🔹 REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? 'OK' : 'NO DEFINIDO'); // <-- Agregado aquí
const path = require('path');
const connectDB = require('./src/config/database');

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Conectar a la base de datos
connectDB();

// Importar rutas
const adminRoutes = require('./src/routes/admin');
const authRoutes = require('./src/routes/auth');

// Usar rutas
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Rutas para el frontend (HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'register.html'));
});

module.exports = app;
