// config/database.js
require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB conectado en: ${mongoose.connection.host}`);

    // Listeners para eventos de conexión
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Conexión a MongoDB perdida. Intentando reconectar...');
    });

    mongoose.connection.on('error', (error) => {
      console.error(`❌ Error en la conexión a MongoDB: ${error.message}`);
    });

  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
