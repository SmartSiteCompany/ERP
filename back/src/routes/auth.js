//routes/auth
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const router = express.Router();

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    await RefreshToken.create({ userId: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    return refreshToken;
};

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/refresh', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ error: 'Token requerido' });
        const storedToken = await RefreshToken.findOne({ token });
        if (!storedToken) return res.status(403).json({ error: 'Token inválido' });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Token inválido' });
            const user = await User.findById(decoded.userId);
            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const { token } = req.body;
        await RefreshToken.findOneAndDelete({ token });
        res.json({ message: 'Sesión cerrada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;