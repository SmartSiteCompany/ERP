// Tipos de Usuarios
const TipoUsuarioSchema = new mongoose.Schema({
    id_tipo_usuario: { type: Number, required: true, unique: true },
    tipo_usuario: String,
    lineas_verificentro: [String]
});
