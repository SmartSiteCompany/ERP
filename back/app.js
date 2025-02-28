// app.js
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const connectDB = require('./src/config/database');

// 🔹 Depuración de variables de entorno
console.log('🔹 MONGO_URI:', process.env.MONGO_URI ? 'OK' : 'NO DEFINIDO');
console.log('🔹 ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'OK' : 'NO DEFINIDO');
console.log('🔹 REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? 'OK' : 'NO DEFINIDO');

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Conectar a la base de datos
connectDB();

// Importar rutas
const adminRoutes = require('./src/routes/admin');
const auth = require('./src/routes/auth');
const clienteRoutes = require('./src/routes/clienteRoutes');
const cotizacionRoutes = require('./src/routes/cotizacionRoutes');
const detalleCotizacionRoutes = require('./src/routes/detalleCotizacionRoutes');
const estadoCuentaRoutes = require('./src/routes/estadoCuentaRoutes');
const filialRoutes = require('./src/routes/filialRoutes');
const gastoRoutes = require('./src/routes/gastoRoutes');
const productoServicioRoutes = require('./src/routes/productoServicioRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Usar rutas
app.use('/api/admin', adminRoutes);
app.use('/api/auth', auth);
app.use('/api/clientes', clienteRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);
app.use('/api/detalles-cotizacion', detalleCotizacionRoutes);
app.use('/api/estados-cuenta', estadoCuentaRoutes);
app.use('/api/filiales', filialRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/productos-servicios', productoServicioRoutes);
app.use('/api/usuarios', userRoutes);

// ⚡ No necesitas definir manualmente las rutas HTML si usas express.static
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'public', 'index.html')));

module.exports = app;

