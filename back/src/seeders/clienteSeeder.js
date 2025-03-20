const mongoose = require('mongoose');
const connectDB = require('../config/database'); // Conexión a MongoDB
const Cliente = require('../models/Cliente'); // Modelo Cliente
const clientes = [
    {
        nombre_cliente: "Juan Pérez",
        direccion_cliente: "Av. Reforma 123",
        ciudad_estado_cliente: "CDMX",
        telefono_cliente: "5551234567",
        email_cliente: "juan.perez@correo.com"
    },
    {
        nombre_cliente: "María López",
        direccion_cliente: "Calle 45, Col. Centro",
        ciudad_estado_cliente: "Guadalajara",
        telefono_cliente: "3325678901",
        email_cliente: "maria.lopez@correo.com"
    },
    {
        nombre_cliente: "Carlos Ramírez",
        direccion_cliente: "Blvd. Independencia 789",
        ciudad_estado_cliente: "Monterrey",
        telefono_cliente: "8187654321",
        email_cliente: "carlos.ramirez@correo.com"
    }
];
async function seedClientes() {
    try {
        await connectDB();
        console.log("🔹 Conectado a la base de datos");

        await Cliente.deleteMany(); 
        console.log("🗑 Clientes anteriores eliminados");

        await Cliente.insertMany(clientes);
        console.log("✅ Clientes agregados correctamente");

        mongoose.connection.close(); 
        console.log("🔌 Conexión cerrada");
    } catch (error) {
        console.error("❌ Error al insertar clientes:", error);
        mongoose.connection.close();
    }
}
seedClientes();
