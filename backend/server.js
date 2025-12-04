import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Security middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

app.use('/api/', limiter)

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Email templates
const createEmailTemplate = (userData, calculatorData, prices) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price)
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cotización ISO 27001</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .section { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #14b8a6; }
        .price-box { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .price { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Cotización ISO 27001</h1>
        <p>Solicitud de información para certificación</p>
      </div>

      <div class="section">
        <h2>Datos del Cliente</h2>
        <p><strong>Nombre:</strong> ${userData.name}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>WhatsApp:</strong> ${userData.whatsapp}</p>
      </div>

      <div class="section">
        <h2>Información de la Empresa</h2>
        <p><strong>Número de empleados:</strong> ${calculatorData.employees}</p>
        <p><strong>Número de sitios:</strong> ${calculatorData.sites}</p>
        <p><strong>Sector de actividad:</strong> ${calculatorData.sector}</p>
        <p><strong>Sistema de gestión actual:</strong> ${calculatorData.management}</p>
        <p><strong>Urgencia del proyecto:</strong> ${calculatorData.urgency}</p>
      </div>

      <div class="price-box">
        <h2>Cotización Estimada</h2>
        <div class="price">${formatPrice(prices.min)} - ${formatPrice(prices.max)}</div>
        <p>*Precio estimado basado en la información proporcionada</p>
      </div>

      <div class="section">
        <h2>Próximos Pasos</h2>
        <p>Nos pondremos en contacto contigo en las próximas 24 horas para:</p>
        <ul>
          <li>Revisar los detalles de tu solicitud</li>
          <li>Proporcionar una cotización más detallada</li>
          <li>Explicar el proceso de certificación</li>
          <li>Programar una consulta personalizada</li>
        </ul>
      </div>

      <div class="footer">
        <p>¡Gracias por tu interés en la certificación ISO 27001!</p>
        <p>Este email fue generado automáticamente desde la calculadora de certificación.</p>
      </div>
    </body>
    </html>
  `
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

app.post('/api/send-quote', async (req, res) => {
  try {
    const { userData, calculatorData, prices } = req.body

    // Validate required fields
    if (!userData.name || !userData.email || !userData.whatsapp) {
      return res.status(400).json({ error: 'Missing required user data' })
    }

    if (!calculatorData.employees || !calculatorData.sector || !calculatorData.management || !calculatorData.urgency) {
      return res.status(400).json({ error: 'Missing required calculator data' })
    }

    // Validate corporate email
    const corporateEmailRegex = /^[^\s@]+@(?!gmail|hotmail|yahoo|outlook|live|msn|aol|icloud|me|mac)\w+\.\w+$/i
    if (!corporateEmailRegex.test(userData.email)) {
      return res.status(400).json({ error: 'Corporate email required' })
    }

    // Validate WhatsApp (10 digits)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(userData.whatsapp)) {
      return res.status(400).json({ error: 'WhatsApp must be 10 digits' })
    }

    // TODO: Configure SMTP credentials before enabling email sending
    // For now, just return success to show prices without sending email

    console.log('Quote request received:', {
      user: userData.name,
      email: userData.email,
      whatsapp: userData.whatsapp,
      company: calculatorData,
      priceRange: `${prices.min} - ${prices.max}`
    })

    /* EMAIL FUNCTIONALITY TEMPORARILY DISABLED
    // Create email content
    const htmlContent = createEmailTemplate(userData, calculatorData, prices)

    // Email options
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
      subject: `Nueva Cotización ISO 27001 - ${userData.name}`,
      html: htmlContent
    }

    // Send email
    await transporter.sendMail(mailOptions)
    */

    res.json({
      success: true,
      message: 'Quote processed successfully'
    })

  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({
      error: 'Failed to send quote',
      details: error.message
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})