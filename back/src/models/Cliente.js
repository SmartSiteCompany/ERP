// models/Cliente.js
const ClienteSchema = new mongoose.Schema({
    nombre_cliente: String,
    direccion_cliente: String,
    ciudad_estado_cliente: String,
    telefono_cliente: String,
    email_cliente: String
});

module.exports = mongoose.model('Cliente', ClienteSchema);
