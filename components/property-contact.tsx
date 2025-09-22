import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WhatsAppIntegration } from "@/components/whatsapp-integration"
import { Mail, User, Phone, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PropertyContactProps {
  property: any
}

export function PropertyContact({ property }: PropertyContactProps) {
  const contactName = property.seller
    ? `${property.seller.first_name} ${property.seller.last_name}`
    : property.contact_name

  const contactWhatsApp = property.seller?.whatsapp || property.whatsapp_number
  const contactEmail = property.seller?.email || property.contact_email
  const contactPhone = property.contact_phone
  const isSeller = !!property.seller

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSeller ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
          {isSeller ? "Vendedor Asignado" : "Información de Contacto"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {isSeller && (
            <div className="relative flex-shrink-0">
              {property.seller.profile_photo ? (
                <img
                  src={property.seller.profile_photo || "/placeholder.svg"}
                  alt={`${property.seller.first_name} ${property.seller.last_name}`}
                  className="h-12 w-12 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg">{contactName}</p>
            {contactEmail && <p className="text-muted-foreground text-sm">{contactEmail}</p>}
            {isSeller && (
              <Badge variant="secondary" className="mt-1">
                Vendedor Oficial
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {contactWhatsApp && (
            <WhatsAppIntegration
              phoneNumber={contactWhatsApp}
              propertyTitle={property.title}
              contactName={contactName}
              type="property"
              className="w-full"
            />
          )}

          {!contactWhatsApp && contactPhone && (
            <Button asChild className="w-full" size="lg">
              <a href={`tel:${contactPhone}`}>
                <Phone className="w-5 h-5 mr-2" />
                Llamar: {contactPhone}
              </a>
            </Button>
          )}

          {contactEmail && (
            <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
              <a href={`mailto:${contactEmail}?subject=Consulta sobre: ${property.title}`}>
                <Mail className="w-5 h-5 mr-2" />
                Enviar Email
              </a>
            </Button>
          )}
        </div>

        <div className="pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Al contactar, menciona que viste esta propiedad en Costa del Inmigrante 2.0
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
