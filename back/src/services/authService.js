// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    await RefreshToken.create({ userId: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    return refreshToken;
};


exports.register = async ({ username, password, role }) => {
    if (await User.findOne({ username })) throw new Error('El usuario ya existe');
    console.log('Contraseña antes de encriptar:', password);
    const hashedPassword = await bcrypt.hash(password, 10); // 🔹 Se encripta la contraseña antes de guardarla
    const user = new User({ username, password: hashedPassword, role });
    return await user.save();
};


exports.login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    console.log('Usuario encontrado en BD:', user); 
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales inválidas');
    }
    console.log('🔎 Contraseña ingresada:', password);
    console.log('🔒 Hash almacenado:', user.password);

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('✅ Resultado de bcrypt.compare:', isMatch);

        if (!isMatch) {
            console.log('❌ Contraseña incorrecta');
            throw new Error('Credenciales inválidas');
        }
    return {
        accessToken: generateAccessToken(user),
        refreshToken: await generateRefreshToken(user)
    };
} catch (error) {
    console.log('⚠️ Error en bcrypt.compare:', error);
    throw new Error('Error al verificar la contraseña');
}
};

exports.refreshToken = async (token) => {
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) throw new Error('Token inválido');

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        return generateAccessToken(user);
    } catch (error) {
        throw new Error('Token expirado o inválido');
    }
};


exports.logout = async (token) => {
    await RefreshToken.findOneAndDelete({ token });
};



