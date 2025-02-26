const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false, // No usar SSL/TLS
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: '"CRM App" <noreply@crm.com>',
      to,
      subject,
      text,
    });
    console.log(`📧 Correo enviado a ${to}`);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
}

module.exports = { sendEmail };
