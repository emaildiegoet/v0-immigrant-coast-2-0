import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square, Eye, UserCheck, MessageCircle, User } from "lucide-react"

interface PropertyDetailsProps {
  property: any
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
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
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.address}</span>
            </div>
            {property.neighborhood && <p className="text-muted-foreground">Barrio: {property.neighborhood}</p>}
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-primary mb-2">{formatPrice(property.price, property.currency)}</div>
            <div className="flex gap-2">
              <Badge variant="secondary">{getTransactionTypeLabel(property.transaction_type)}</Badge>
              <Badge variant="outline">{getPropertyTypeLabel(property.property_type)}</Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} dormitorios</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} baños</span>
            </div>
          )}
          {property.area_m2 && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area_m2}m² construidos</span>
            </div>
          )}
          {property.lot_size_m2 && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.lot_size_m2}m² terreno</span>
            </div>
          )}
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{property.views_count || 0} vistas</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
        </CardContent>
      </Card>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature: string, index: number) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seller Information */}
      {property.seller && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Vendedor Asignado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  {property.seller.profile_photo ? (
                    <img
                      src={property.seller.profile_photo || "/placeholder.svg"}
                      alt={`${property.seller.first_name} ${property.seller.last_name}`}
                      className="h-16 w-16 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xl">
                    {property.seller.first_name} {property.seller.last_name}
                  </p>
                  {property.seller.email && (
                    <p className="text-muted-foreground text-sm mt-1">{property.seller.email}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {property.seller.whatsapp}</span>
                  </div>
                </div>
              </div>

              {property.seller.description && (
                <div className="pt-3 border-t">
                  <p className="text-muted-foreground leading-relaxed">{property.seller.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tipo de operación:</span>
            <span className="font-medium">{getTransactionTypeLabel(property.transaction_type)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tipo de propiedad:</span>
            <span className="font-medium">{getPropertyTypeLabel(property.property_type)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Moneda:</span>
            <span className="font-medium">
              {property.currency === "UYU" ? "Pesos Uruguayos" : "Dólares Americanos"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Publicado:</span>
            <span className="font-medium">{formatDate(property.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
