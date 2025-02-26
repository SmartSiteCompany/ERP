// models/Filial.js
const FilialSchema = new mongoose.Schema({
    nombre_filial: String,
    slug_filial: String,
    imagen_filial: String,
    cotizaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion' }]
});

module.exports = mongoose.model('Filial', FilialSchema);
