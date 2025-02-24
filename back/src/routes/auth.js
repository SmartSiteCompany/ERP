//routes/auth
const express = require('express');
const authService = require('../services/authService');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'Usuario registrado', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const tokens = await authService.login(req.body);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/refresh', async (req, res) => {
    try {
        const accessToken = await authService.refreshToken(req.body.token);
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        await authService.logout(req.body.token);
        res.json({ message: 'Sesión cerrada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
