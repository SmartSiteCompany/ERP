// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { nombre, apellidos, email, password, role } = req.body;

        if (!nombre || !apellidos || !email || !password) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            nombre,
            apellidos,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        await newUser.save();

        res.status(201).json({ message: 'Registro exitoso', user: { nombre, apellidos, email, role: newUser.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Credenciales incompletas' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log("Usuario no encontrado:", email);
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        console.log("Contraseña enviada:", password);
        console.log("Contraseña hasheada en la BD:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("¿Coincide la contraseña?", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET no está definido en las variables de entorno");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Inicio de sesión exitoso', accessToken: token });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
