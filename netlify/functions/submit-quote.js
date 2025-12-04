const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Manejar OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Configuración del transporter (CORREGIDO: createTransport, no createTransporter)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? '***' : 'missing',
      pass: process.env.SMTP_PASS ? '***' : 'missing'
    });

    // Contenido del email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'Nueva solicitud de cotización ISO 27001',
      html: `
        <h2>Nueva solicitud de cotización ISO 27001</h2>
        <h3>Información del cliente:</h3>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        
        <h3>Información de la empresa:</h3>
        <p><strong>Empleados:</strong> ${data.empleados}</p>
        <p><strong>Sitios:</strong> ${data.sitios}</p>
        <p><strong>Sector:</strong> ${data.sector}</p>
        <p><strong>Sistema de gestión:</strong> ${data.gestion}</p>
        <p><strong>Urgencia:</strong> ${data.urgencia}</p>
        
        <h3>Cotización estimada:</h3>
        <p><strong>Precio mínimo:</strong> $${data.precioMinimo?.toLocaleString()}</p>
        <p><strong>Precio máximo:</strong> $${data.precioMaximo?.toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno del servidor', details: error.message })
    };
  }
};
