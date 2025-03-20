const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Puedes usar otro servicio como Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASSWORD, // Tu contraseña de correo
  },
});

module.exports = transporter;