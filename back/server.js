// server.js
const app = require('./app'); // Importamos la configuración de la app
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en ejecución: http://localhost:${PORT}`);
});

