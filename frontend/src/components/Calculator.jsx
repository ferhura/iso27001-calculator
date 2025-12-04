import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Calculator = ({ isIframe = false, isDesktop = false }) => {
  const [formData, setFormData] = useState({
    employees: '',
    sites: 1,
    sector: '',
    management: '',
    urgency: ''
  })

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const [prices, setPrices] = useState({ min: 0, max: 0 })
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [gridCols, setGridCols] = useState('grid-cols-1')
  const containerRef = useRef(null)

  const [auditDays, setAuditDays] = useState(0)

  const employeeOptions = [
    { value: 'less-10', label: 'Menos de 10 personas', baseDays: 5 },
    { value: '11-25', label: '11 a 25 personas', baseDays: 7 },
    { value: '26-50', label: '26 a 50 personas', baseDays: 9.5 },
    { value: 'more-50', label: 'Más de 50 personas', baseDays: 12 }
  ]

  const sectorOptions = [
    { value: 'service', label: 'Servicios', multiplier: 1.0 },
    { value: 'commerce', label: 'Comercio', multiplier: 1.0 },
    { value: 'manufacturing', label: 'Manufactura', multiplier: 1.1 },
    { value: 'other', label: 'Otro', multiplier: 1.1 },
    { value: 'tech', label: 'Tecnología / Desarrollo de Software', multiplier: 1.25 },
    { value: 'finance', label: 'Finanzas / Seguros', multiplier: 1.25 },
    { value: 'health', label: 'Salud', multiplier: 1.25 }
  ]

  const managementOptions = [
    { value: 'no', label: 'No', multiplier: 1.1 },
    { value: 'yes', label: 'Sí', multiplier: 1.0 }
  ]

  const urgencyOptions = [
    { value: 'more-6', label: 'Más de 6 meses (no me urge)', multiplier: 1.0 },
    { value: '6-months', label: '6 meses (tiempo promedio)', multiplier: 1.0 },
    { value: '3-5-months', label: '3 a 5 meses (express)', multiplier: 1.0 },
    { value: 'immediate', label: 'Inmediato, me urge cuanto antes', multiplier: 1.2 }
  ]

  const calculatePrice = () => {
    if (!formData.employees || !formData.sector || !formData.management || !formData.urgency) {
      setPrices({ min: 0, max: 0 })
      setAuditDays(0)
      return
    }

    const employeeBaseDays = employeeOptions.find(e => e.value === formData.employees)?.baseDays || 0
    const sectorMultiplier = sectorOptions.find(s => s.value === formData.sector)?.multiplier || 1
    const managementMultiplier = managementOptions.find(m => m.value === formData.management)?.multiplier || 1
    const urgencyMultiplier = urgencyOptions.find(u => u.value === formData.urgency)?.multiplier || 1

    // Calculate total days
    // Base days * Sector * Management * Urgency
    let totalDays = employeeBaseDays * sectorMultiplier * managementMultiplier * urgencyMultiplier

    // Add days for additional sites (1 day per additional site)
    const additionalSitesDays = (formData.sites - 1) * 1
    totalDays += additionalSitesDays

    // Round to nearest 0.5
    totalDays = Math.round(totalDays * 2) / 2

    setAuditDays(totalDays)

    const dailyRate = 13000
    const finalPrice = totalDays * dailyRate

    const minPrice = Math.round(finalPrice)
    const maxPrice = Math.round(finalPrice * 1.10) // 10% range

    setPrices({ min: minPrice, max: maxPrice })
  }

  useEffect(() => {
    calculatePrice()
  }, [formData])

  useEffect(() => {
    if (isIframe && containerRef.current) {
      const updateGridCols = (width) => {
        setGridCols(width >= 800 ? 'grid-cols-2' : 'grid-cols-1')
      }

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width } = entry.contentRect
          updateGridCols(width)
        }
      })

      resizeObserver.observe(containerRef.current)
      updateGridCols(containerRef.current.offsetWidth)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [isIframe])

  const isCompanyFormComplete = () => {
    return formData.employees && formData.sector && formData.management && formData.urgency
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUserDataChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRequestDetailedQuote = () => {
    setShowContactForm(true)
  }

  const validateEmail = (email) => {
    const corporateEmailRegex = /^[^\s@]+@(?!gmail|hotmail|yahoo|outlook|live|msn|aol|icloud|me|mac)\w+\.\w+$/i
    return corporateEmailRegex.test(email)
  }

  const validateWhatsApp = (phone) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userData.name.trim()) {
      setSubmitMessage('Por favor ingresa tu nombre')
      return
    }

    if (!validateEmail(userData.email)) {
      setSubmitMessage('Por favor ingresa un email corporativo válido (no Gmail, Hotmail, Yahoo, etc.)')
      return
    }

    if (!validateWhatsApp(userData.whatsapp)) {
      setSubmitMessage('Por favor ingresa un número de WhatsApp válido (10 dígitos)')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const emailData = {
        nombre: userData.name,
        email: userData.email,
        whatsapp: userData.whatsapp,
        empleados: employeeOptions.find(e => e.value === formData.employees)?.label,
        sitios: formData.sites,
        sector: sectorOptions.find(s => s.value === formData.sector)?.label,
        gestion: managementOptions.find(m => m.value === formData.management)?.label,
        urgencia: urgencyOptions.find(u => u.value === formData.urgency)?.label,
        precioMinimo: prices.min,
        precioMaximo: prices.max
      }

      await axios.post('/.netlify/functions/submit-quote', emailData)

      // Show success message instead of redirect
      setShowSuccessMessage(true)
      setShowContactForm(false)
    } catch (error) {
      setSubmitMessage('Error al enviar la cotización. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const resetFlow = () => {
    setShowContactForm(false)
    setShowSuccessMessage(false)
    setUserData({ name: '', email: '', whatsapp: '' })
    setSubmitMessage('')
  }

  return (
    <div ref={containerRef} className={`calculator-card rounded-2xl shadow-2xl ${isDesktop || isIframe ? 'p-1' : 'p-4'}`}>
      <div className={`grid ${isDesktop ? 'grid-cols-2' : isIframe ? gridCols : 'md:grid-cols-2'} ${isDesktop || isIframe ? 'gap-2' : 'gap-4'}`}>
        {/* Company Form - Left Column */}
        <div className={`${isDesktop || isIframe ? 'space-y-2' : 'space-y-4'}`}>
          <h2 className={`text-xl font-bold text-primary-800 text-center ${isDesktop || isIframe ? 'mb-2' : 'mb-4'}`}>
            Información de tu empresa
          </h2>

          {/* Employees */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 ${isDesktop || isIframe ? 'mb-1' : 'mb-2'}`}>
              Número de empleados
            </label>
            <select
              name="employees"
              value={formData.employees}
              onChange={handleInputChange}
              className={`w-full text-sm border border-gray-300 rounded-lg form-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isDesktop || isIframe ? 'p-2' : 'p-2.5'}`}
            >
              <option value="">Selecciona una opción</option>
              {employeeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sites */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 ${isDesktop || isIframe ? 'mb-1' : 'mb-2'}`}>
              Número de sitios
            </label>
            <input
              type="number"
              name="sites"
              value={formData.sites}
              onChange={handleInputChange}
              min="1"
              className={`w-full text-sm border border-gray-300 rounded-lg form-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isDesktop || isIframe ? 'p-2' : 'p-2.5'}`}
            />
          </div>

          {/* Sector */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 ${isDesktop || isIframe ? 'mb-1' : 'mb-2'}`}>
              Sector de actividad
            </label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleInputChange}
              className={`w-full text-sm border border-gray-300 rounded-lg form-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isDesktop || isIframe ? 'p-2' : 'p-2.5'}`}
            >
              <option value="">Selecciona una opción</option>
              {sectorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Management System */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 ${isDesktop || isIframe ? 'mb-1' : 'mb-2'}`}>
              ¿Cuentas con un sistema de gestión?
            </label>
            <select
              name="management"
              value={formData.management}
              onChange={handleInputChange}
              className={`w-full text-sm border border-gray-300 rounded-lg form-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isDesktop || isIframe ? 'p-2' : 'p-2.5'}`}
            >
              <option value="">Selecciona una opción</option>
              {managementOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 ${isDesktop || isIframe ? 'mb-1' : 'mb-2'}`}>
              Urgencia del proyecto
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className={`w-full text-sm border border-gray-300 rounded-lg form-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isDesktop || isIframe ? 'p-2' : 'p-2.5'}`}
            >
              <option value="">Selecciona una opción</option>
              {urgencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column - Quote Section */}
        <div className={`${isDesktop || isIframe ? 'space-y-2' : 'space-y-4'}`}>
          <h2 className={`text-xl font-bold text-primary-800 text-center ${isDesktop || isIframe ? 'mb-2' : 'mb-4'}`}>
            Tu cotización ISO 27001
          </h2>

          {/* Show price when form is complete, otherwise show placeholder */}
          {isCompanyFormComplete() && prices.min > 0 ? (
            <>
              {/* Price Display */}
              <div className="price-display rounded-xl p-4 text-center">
                <div className="mb-3">
                  <h3 className="text-base font-semibold mb-2">Rango de precio</h3>
                  <div className="text-2xl font-bold">
                    {formatPrice(prices.min)} - {formatPrice(prices.max)}
                  </div>
                  <div className="text-sm text-primary-700 font-medium mt-1">
                    Días estimados de auditoría: {auditDays}
                  </div>
                </div>
                <p className="text-xs opacity-90 mt-2">
                  *Esta es una cotización inicial estimada. El precio definitivo se confirmará una vez completado el formato de solicitud de servicio.
                </p>
              </div>

              {/* Request Detailed Quote Button */}
              {!showContactForm && !showSuccessMessage && (
                <div className="text-center">
                  <button
                    onClick={handleRequestDetailedQuote}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    Recibir cotización precisa y personalizada
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Placeholder when form is not complete */
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-sm">
                Completa todos los campos a la izquierda para ver tu cotización estimada aquí
              </p>
            </div>
          )}

          {/* Contact Form */}
          {showContactForm && (
            <div className="bg-white border-2 border-primary-200 rounded-xl p-3">
              <h3 className="text-base font-bold text-primary-800 mb-2 text-center">
                Datos de contacto
              </h3>

              <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleUserDataChange}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded form-input focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Email corporativo *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleUserDataChange}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded form-input focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-0.5">
                    No Gmail, Hotmail, Yahoo, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={userData.whatsapp}
                    onChange={handleUserDataChange}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded form-input focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="10 dígitos"
                    required
                  />
                </div>

                {submitMessage && (
                  <div className="p-1.5 rounded text-xs bg-red-100 text-red-800">
                    {submitMessage}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary text-white px-2 py-1.5 rounded font-semibold disabled:opacity-50 text-xs"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="space-y-4">
              <div className="bg-green-100 p-6 rounded-2xl text-center">
                <div className="text-green-800">
                  <h3 className="text-lg font-semibold mb-2">¡Solicitud enviada exitosamente!</h3>
                  <p>Recibirás una cotización precisa y personalizada pronto. Te contactaremos a la brevedad.</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={resetFlow}
                  className="px-6 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50"
                >
                  Nueva cotización
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calculator