import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square, Star, MessageCircle, Phone, UserCheck, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PropertyCardProps {
  property: any
  featured?: boolean
}

export function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: currency === "UYU" ? "UYU" : "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTransactionTypeLabel = (type: string) => {
    const labels = {
      venta: "Venta",
      alquiler: "Alquiler",
      alquiler_temporal: "Alquiler Temporal",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      casa: "Casa",
      apartamento: "Apartamento",
      terreno: "Terreno",
      comercial: "Comercial",
      quinta: "Quinta",
    }
    return labels[type as keyof typeof labels] || type
  }

  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : `/placeholder.svg?height=200&width=300&query=propiedad+${property.property_type}`

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${featured ? "ring-2 ring-secondary/20" : ""}`}>
      <div className="relative overflow-hidden rounded-t-lg">
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-secondary text-secondary-foreground">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacada
            </Badge>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary">{getTransactionTypeLabel(property.transaction_type)}</Badge>
        </div>

        <Image
          src={primaryImage || "/placeholder.svg"}
          alt={property.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{property.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-primary">{formatPrice(property.price, property.currency)}</div>
          <Badge variant="outline">{getPropertyTypeLabel(property.property_type)}</Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area_m2 && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area_m2}m²</span>
            </div>
          )}
        </div>

        {property.seller && (
          <div className="flex items-center gap-3 mb-3 p-2 bg-muted/50 rounded-md">
            <div className="relative flex-shrink-0">
              {property.seller.profile_photo ? (
                <img
                  src={property.seller.profile_photo || "/placeholder.svg"}
                  alt={`${property.seller.first_name} ${property.seller.last_name}`}
                  className="h-8 w-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="text-sm min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">
                {property.seller.first_name} {property.seller.last_name}
              </p>
              <p className="text-xs text-muted-foreground">Vendedor</p>
            </div>
            <UserCheck className="w-4 h-4 text-primary flex-shrink-0" />
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link href={`/propiedades/${property.id}`}>Ver Detalles</Link>
          </Button>

          {property.seller?.whatsapp ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://wa.me/${property.seller.whatsapp.replace(/[^0-9]/g, "")}?text=Hola, me interesa la propiedad: ${property.title}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </Button>
          ) : (
            property.whatsapp_number && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://wa.me/${property.whatsapp_number.replace(/[^0-9]/g, "")}?text=Hola, me interesa la propiedad: ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </Button>
            )
          )}

          {property.contact_phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${property.contact_phone}`}>
                <Phone className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
