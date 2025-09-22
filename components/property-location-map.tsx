"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface PropertyLocationMapProps {
  address: string
  latitude?: number
  longitude?: number
  title?: string
  className?: string
}

export function PropertyLocationMap({ address, latitude, longitude, title, className = "" }: PropertyLocationMapProps) {
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const defaultLat = -34.431266198071164
  const defaultLng = -57.26915359497071

  const openInGoogleMaps = () => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
    } else {
      const query = encodeURIComponent(`${address}, Costa del Inmigrante, Colonia, Uruguay`)
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
    }
  }

  const getDirections = () => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, "_blank")
    } else {
      const query = encodeURIComponent(`${address}, Costa del Inmigrante, Colonia, Uruguay`)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, "_blank")
    }
  }

  useEffect(() => {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    if (!window.L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        initMap()
      }
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      // Cleanup map on unmount
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const initMap = () => {
    const mapElement = document.getElementById("property-location-map")
    if (!mapElement || !window.L || mapRef.current) return

    // Use property coordinates if available, otherwise use default center
    const centerLat = latitude || defaultLat
    const centerLng = longitude || defaultLng

    // @ts-ignore - Leaflet will be loaded dynamically
    mapRef.current = window.L.map("property-location-map").setView([centerLat, centerLng], 15)

    // Add OpenStreetMap tiles
    // @ts-ignore - Leaflet will be loaded dynamically
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current)

    // Add marker if coordinates exist
    if (latitude && longitude) {
      // @ts-ignore - Leaflet will be loaded dynamically
      markerRef.current = window.L.marker([latitude, longitude])
        .addTo(mapRef.current)
        .bindPopup(`<b>${title || "Propiedad"}</b><br>${address}`)
        .openPopup()
    }

    setIsMapLoaded(true)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          id="property-location-map"
          className="w-full h-64 rounded-lg border bg-muted"
          style={{ minHeight: "300px" }}
        />
      </CardContent>
    </Card>
  )
}

// Extend Window interface for Leaflet
declare global {
  interface Window {
    L: any
  }
}
