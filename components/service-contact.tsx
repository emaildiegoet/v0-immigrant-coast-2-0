import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WhatsAppIntegration } from "@/components/whatsapp-integration"
import { User, Phone } from "lucide-react"

interface ServiceContactProps {
  service: any
}

export function ServiceContact({ service }: ServiceContactProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Contactar Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold text-lg">{service.contact_name}</p>
          <p className="text-muted-foreground">{service.name}</p>
        </div>

        <div className="space-y-3">
          {service.whatsapp_number && (
            <WhatsAppIntegration
              phoneNumber={service.whatsapp_number}
              serviceName={service.name}
              contactName={service.contact_name}
              type="service"
              className="w-full"
            />
          )}

          {!service.whatsapp_number && service.contact_phone && (
            <Button asChild className="w-full" size="lg">
              <a href={`tel:${service.contact_phone}`}>
                <Phone className="w-5 h-5 mr-2" />
                Llamar: {service.contact_phone}
              </a>
            </Button>
          )}
        </div>

        <div className="pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Al contactar, menciona que encontraste este servicio en Costa del Inmigrante 2.0
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
