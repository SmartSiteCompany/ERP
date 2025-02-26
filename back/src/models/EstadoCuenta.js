// models/EstadoCuenta.js
const mongoose = require('mongoose');

const EstadoCuentaSchema = new mongoose.Schema({
    total_estado_cuenta: Number,
    anticipo_estado_cuenta: Number,
    restante: Number,
    cantidad_semanas: Number,
    dia_pago: String,
    metodo_pago: String,
    recargo_impuntualidad: Number,
    id_cotizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion' }
});

module.exports = mongoose.model('EstadoCuenta', EstadoCuentaSchema);
