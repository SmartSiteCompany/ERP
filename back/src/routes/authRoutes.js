const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });

        await user.save();
        res.json({ message: 'Registro exitoso' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el registro' });
    }
});

module.exports = router;
