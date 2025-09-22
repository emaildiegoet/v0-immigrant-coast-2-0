"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Phone } from "lucide-react"
import { useState } from "react"

interface WhatsAppIntegrationProps {
  phoneNumber: string
  propertyTitle?: string
  serviceName?: string
  contactName?: string
  type: "property" | "service"
  className?: string
}

export function WhatsAppIntegration({
  phoneNumber,
  propertyTitle,
  serviceName,
  contactName,
  type,
  className = "",
}: WhatsAppIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const generateMessage = () => {
    const baseMessage = "¡Hola! Te contacto desde Costa del Inmigrante 2.0"

    if (type === "property" && propertyTitle) {
      return `${baseMessage}. Me interesa la propiedad: "${propertyTitle}". ¿Podrías darme más información sobre disponibilidad, precio y condiciones? ¡Gracias!`
    }

    if (type === "service" && serviceName) {
      return `${baseMessage}. Me interesa tu servicio: "${serviceName}". ¿Podrías darme más información sobre disponibilidad, precios y cómo trabajas? ¡Gracias!`
    }

    return `${baseMessage}. Me gustaría obtener más información. ¿Podrías ayudarme? ¡Gracias!`
  }

  const handleWhatsAppClick = () => {
    setIsLoading(true)
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "")
    const message = encodeURIComponent(generateMessage())
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")

    // Simular loading para mejor UX
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        onClick={handleWhatsAppClick}
        disabled={isLoading}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        {isLoading ? "Abriendo WhatsApp..." : "WhatsApp"}
      </Button>

      <Button onClick={handleCallClick} variant="outline" size="lg" className="bg-transparent">
        <Phone className="w-5 h-5" />
      </Button>
    </div>
  )
}

// Hook para generar mensajes automáticos de WhatsApp
export function useWhatsAppMessage() {
  const generatePropertyMessage = (property: any) => {
    const price = new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: property.currency === "UYU" ? "UYU" : "USD",
      minimumFractionDigits: 0,
    }).format(property.price)

    return `¡Hola! Te contacto desde Costa del Inmigrante 2.0 🏠

Me interesa mucho la propiedad: "${property.title}"
📍 Ubicación: ${property.address}
💰 Precio: ${price}

Me gustaría saber más sobre:
• Disponibilidad para visita
• Estado de la propiedad
• Documentación
• Posibilidad de financiación

¿Cuándo podríamos coordinar una visita?

¡Gracias!`
  }

  const generateServiceMessage = (service: any) => {
    return `¡Hola! Te contacto desde Costa del Inmigrante 2.0 🔧

Me interesa tu servicio: "${service.name}"
📍 Zona: ${service.address || "Costa del Inmigrante"}

Me gustaría saber más sobre:
• Disponibilidad
• Precios y formas de pago
• Experiencia y referencias
• Tiempo estimado de trabajo

¿Podrías darme un presupuesto?

¡Gracias!`
  }

  return {
    generatePropertyMessage,
    generateServiceMessage,
  }
}
