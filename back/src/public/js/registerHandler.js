// src/public/js/registerHandler.js
async function register() {
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!nombre || !apellidos || !email || !password) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellidos, email, password, role })
    });
    const data = await response.json();

    if (response.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = "index.html";
    } else {
        alert('Error: ' + data.error);
    }
}

function goToLogin() {
    window.location.href = "index.html";
}

