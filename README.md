# Calculadora ISO 9001 - Aplicación Completa

Una aplicación web completa para calcular cotizaciones de certificación ISO 9001 con sistema de emails integrado.

## 🌟 Características

- **Frontend React moderno** con Vite y Tailwind CSS
- **Backend Node.js** con Express y sistema de emails
- **Diseño responsive** y profesional
- **Validación completa** de datos del usuario
- **Sistema de emails automatizado** con Nodemailer
- **Fácil integración** en WordPress e iframes
- **Cálculos automáticos** en tiempo real
- **Diseño profesional** con colores azul/turquesa

## 📋 Funcionalidades

### Calculadora
- Número de empleados (4 opciones)
- Número de sitios (input numérico)
- Sector de actividad (4 opciones)
- Sistema de gestión actual (Sí/No)
- Urgencia del proyecto (4 opciones)

### Validaciones
- Email corporativo (no Gmail, Hotmail, Yahoo, etc.)
- WhatsApp de 10 dígitos exactos
- Todos los campos requeridos

### Sistema de Emails
- Envío automático con todos los datos
- Plantilla HTML profesional
- Información completa del usuario y cálculos
- Configuración SMTP flexible

## 🚀 Instalación

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### 1. Clonar el proyecto
```bash
git clone <repository-url>
cd iso9001-cert-calculator
```

### 2. Instalar dependencias del Frontend
```bash
cd frontend
npm install
```

### 3. Instalar dependencias del Backend
```bash
cd ../backend
npm install
```

### 4. Configurar variables de entorno
```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` con tu configuración:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-app
RECIPIENT_EMAIL=destinatario@empresa.com

# Server Configuration
PORT=5000
```

### 5. Ejecutar la aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🏗️ Estructura del Proyecto

```
iso9001-cert-calculator/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Calculator.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
└── README.md
```

## 💰 Lógica de Cálculo

### Valores Base por Empleados
- Menos de 10 personas: $25,000
- 11 a 25 personas: $30,000
- 26 a 50 personas: $35,000
- Más de 50 personas: $40,000

### Multiplicadores
- **Sector:**
  - Servicio: 1.0
  - Manufactura: 1.2
  - Comercio: 1.1
  - Otro: 1.2

- **Sistema de Gestión:**
  - No: 1.5
  - Sí: 1.0

- **Urgencia:**
  - Más de 6 meses: 1.0
  - 6 meses: 1.1
  - 3 a 5 meses: 1.4
  - Inmediato: 1.8

### Fórmula
```
Precio = (base_empleados + ((sitios - 1) * 5000)) * sector * gestión * urgencia
Precio máximo = Precio mínimo * 1.15
```

## 📧 Configuración de Email

### Gmail
1. Habilitar 2FA en tu cuenta Gmail
2. Generar una "Contraseña de aplicación"
3. Usar la contraseña de aplicación en `SMTP_PASS`

### Otros proveedores
Actualiza los valores de `SMTP_HOST` y `SMTP_PORT` según tu proveedor.

## 🌐 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
```

### Backend (Heroku/Railway)
```bash
cd backend
npm start
```

### Docker (Opcional)
```dockerfile
# Dockerfile para el backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Personalización

### Colores
Los colores están definidos en `frontend/tailwind.config.js`:
- `primary`: Colores turquesa/teal
- `secondary`: Colores azul

### Validaciones
Las validaciones están en `frontend/src/components/Calculator.jsx`:
- Email corporativo: línea 63
- WhatsApp: línea 67

### Plantilla de Email
La plantilla HTML está en `backend/server.js` línea 31.

## 🎯 Integración en WordPress

### Como iframe
```html
<iframe 
  src="https://tu-dominio.com" 
  width="100%" 
  height="800" 
  frameborder="0">
</iframe>
```

### Como embed
```html
<div id="iso9001-calculator"></div>
<script>
  // Código de integración personalizado
</script>
```

## 🐛 Troubleshooting

### Error de CORS
Verifica que el backend esté configurado correctamente en `server.js`.

### Error de Email
1. Verifica las credenciales SMTP
2. Revisa que el email no esté en spam
3. Confirma que el proveedor permite aplicaciones menos seguras

### Error de Build
```bash
# Limpiar caché
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 API Endpoints

### GET /api/health
Verificar estado del servidor

### POST /api/send-quote
Enviar cotización por email

**Body:**
```json
{
  "userData": {
    "name": "string",
    "email": "string",
    "whatsapp": "string"
  },
  "calculatorData": {
    "employees": "string",
    "sites": "number",
    "sector": "string",
    "management": "string",
    "urgency": "string"
  },
  "prices": {
    "min": "number",
    "max": "number"
  }
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@empresa.com
- WhatsApp: +52 xxx xxx xxxx

---

**Desarrollado con ❤️ para certificaciones ISO 9001**