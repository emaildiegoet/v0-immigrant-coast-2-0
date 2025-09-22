"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Maximize2 } from "lucide-react"

interface GoogleMapProps {
  address: string
  latitude?: number
  longitude?: number
  title?: string
  className?: string
}

export function GoogleMap({ address, latitude, longitude, title, className = "" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // For now, we'll show the fallback view with external links
    setError("Google Maps API not configured")
  }, [])

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(`${address}, Costa del Inmigrante, Colonia, Uruguay`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
  }

  const getDirections = () => {
    const query = encodeURIComponent(`${address}, Costa del Inmigrante, Colonia, Uruguay`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, "_blank")
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Ubicación: {address}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={getDirections} variant="outline" size="sm">
              <Navigation className="w-4 h-4 mr-2" />
              Cómo llegar
            </Button>
            <Button onClick={openInGoogleMaps} variant="outline" size="sm">
              <Maximize2 className="w-4 h-4 mr-2" />
              Ver en Google Maps
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">{title || "Ubicación"}</p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
