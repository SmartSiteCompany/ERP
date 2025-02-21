const express = require('express');
require('dotenv').config();
const connectDB = require('./src/config/database');

const app = express();

app.use(express.json());

connectDB();

const adminRoutes = require('./src/routes/admin');
app.use('/api/admin', adminRoutes);

app.use('/api/auth', require('./src/routes/auth'));

const User = require('./src/models/User');

// Prueba de creacion usuario
app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ message: 'Usuario creado', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = app;
