const mongoose = require('mongoose');
const connectDB = require('../config/database'); // Conexión a MongoDB
const Cliente = require('../models/Cliente'); // Modelo Cliente

// Datos de ejemplo
const clientes = [
    {
        nombre_cliente: "Juan Pérez",
        direccion_cliente: "Av. Reforma 123",
        ciudad_estado_cliente: "CDMX",
        telefono_cliente: "5551234567",
        email_cliente: "juan.perez@example.com"
    },
    {
        nombre_cliente: "María López",
        direccion_cliente: "Calle 45, Col. Centro",
        ciudad_estado_cliente: "Guadalajara",
        telefono_cliente: "3325678901",
        email_cliente: "maria.lopez@example.com"
    },
    {
        nombre_cliente: "Carlos Ramírez",
        direccion_cliente: "Blvd. Independencia 789",
        ciudad_estado_cliente: "Monterrey",
        telefono_cliente: "8187654321",
        email_cliente: "carlos.ramirez@example.com"
    }
];

async function seedClientes() {
    try {
        await connectDB(); // Conectar a la base de datos
        console.log("🔹 Conectado a la base de datos");

        await Cliente.deleteMany(); // Elimina clientes anteriores (opcional)
        console.log("🗑 Clientes anteriores eliminados");

        await Cliente.insertMany(clientes); // Inserta nuevos clientes
        console.log("✅ Clientes agregados correctamente");

        mongoose.connection.close(); // Cerrar conexión
        console.log("🔌 Conexión cerrada");
    } catch (error) {
        console.error("❌ Error al insertar clientes:", error);
        mongoose.connection.close();
    }
}

// Ejecutar script
seedClientes();
