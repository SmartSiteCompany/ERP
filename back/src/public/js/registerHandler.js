async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
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
