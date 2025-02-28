const bcrypt = require('bcrypt');

const password = 'Josemicore8';  // Contraseña original
const hashedPassword = '$2b$10$Ch3Ml/Lpji/q/ZcqIqzudurvE7ej8jBY.1QCEvqEGYLKbr3M1XvMi';  // Hash guardado en MongoDB

bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) {
        console.error("❌ Error en bcrypt.compare():", err);
    } else {
        console.log("🔹 Resultado de bcrypt.compare():", result);
    }
});
