// controllers/authController.js
const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    console.log('Datos recibidos en register:', req.body);

    const { email, password, role } = req.body; // Cambiar username → email

    if (!email || !password) {
      return res.status(400).json({ error: 'El email y la contraseña son obligatorios' });
    }

    const user = await authService.register({ email, password, role }); 
    res.status(201).json({ message: 'Usuario registrado con éxito', user });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Datos recibidos en login:', req.body); 

    if (!username || !password) {
      return res.status(400).json({ error: 'Credenciales incompletas' });
    }

    const tokens = await authService.login({ username, password });
    res.status(200).json(tokens);
  } catch (error) {
    res.status(401).json({ error: 'Credenciales inválidas', details: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token de refresco requerido' });
    }

    const accessToken = await authService.refreshToken(token);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Token de refresco inválido o expirado', details: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido para cerrar sesión' });
    }

    await authService.logout(token);
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cerrar sesión', details: error.message });
  }
};
