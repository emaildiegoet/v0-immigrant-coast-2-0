import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, MessageCircle, Phone, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceCardProps {
  service: any
}

export function ServiceCard({ service }: ServiceCardProps) {
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
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-secondary fill-secondary"
            : i < rating
              ? "text-secondary fill-secondary/50"
              : "text-muted-foreground"
        }`}
      />
    ))
  }

  const primaryImage =
    service.images && service.images.length > 0
      ? service.images[0]
      : `/placeholder.svg?height=200&width=300&query=servicio+${service.category}`

  console.log("[v0] Service data:", service)
  console.log("[v0] Service address:", service.address)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={primaryImage || "/placeholder.svg"}
          alt={service.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">{getCategoryLabel(service.category)}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1">{service.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{service.description}</p>

          {service.address && (
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">{service.address}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">{renderStars(service.average_rating || 0)}</div>
            <span className="text-sm text-muted-foreground">({service.total_reviews || 0})</span>
          </div>

          {service.business_hours && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>Horarios</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full" size="sm">
            <Link href={`/servicios/${service.id}`}>Ver Detalles</Link>
          </Button>

          <div className="flex gap-2">
            {service.whatsapp_number && (
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                <a
                  href={`https://wa.me/${service.whatsapp_number.replace(/[^0-9]/g, "")}?text=Hola, me interesa tu servicio: ${service.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            )}

            {service.contact_phone && (
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                <a href={`tel:${service.contact_phone}`}>
                  <Phone className="w-4 h-4 mr-1" />
                  Llamar
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
