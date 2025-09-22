import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, Clock, Phone } from "lucide-react"

interface ServiceDetailsProps {
  service: any
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const getCategoryLabel = (category: string) => {
    const labels = {
      electricista: "Electricista",
      plomero: "Plomero",
      carpintero: "Carpintero",
      pintor: "Pintor",
      jardinero: "Jardinero",
      limpieza: "Limpieza",
      construccion: "Construcción",
      mecanico: "Mecánico",
      veterinario: "Veterinario",
      medico: "Médico",
      abogado: "Abogado",
      contador: "Contador",
      restaurante: "Restaurante",
      supermercado: "Supermercado",
      farmacia: "Farmacia",
      otro: "Otro",
    }
    return labels[category as keyof typeof labels] || category
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "text-secondary fill-secondary"
            : i < rating
              ? "text-secondary fill-secondary/50"
              : "text-muted-foreground"
        }`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">{service.name}</h1>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                {renderStars(service.average_rating || 0)}
                <span className="font-medium">{(service.average_rating || 0).toFixed(1)}</span>
                <span className="text-muted-foreground">({service.total_reviews || 0} reseñas)</span>
              </div>
              <Badge variant="secondary">{getCategoryLabel(service.category)}</Badge>
            </div>

            {service.address && (
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{service.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción del Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{service.description}</p>
        </CardContent>
      </Card>

      {/* Business Hours */}
      {service.business_hours && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(service.business_hours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="font-medium capitalize">{day}:</span>
                  <span className="text-muted-foreground">{hours as string}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Responsable:</span>
            <span className="font-medium">{service.contact_name}</span>
          </div>

          {service.contact_phone && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono:
              </span>
              <span className="font-medium">{service.contact_phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Registrado:</span>
            <span className="font-medium">{formatDate(service.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
