"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface PropertyMapProps {
  latitude: number
  longitude: number
  address: string
}

export function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  // For now, we'll show a placeholder. In a real implementation,
  // you would integrate with Google Maps or another mapping service
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de ${address}`}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">{address}</p>
      </CardContent>
    </Card>
  )
}
