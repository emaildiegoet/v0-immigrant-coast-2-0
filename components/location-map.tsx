"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Locate } from "lucide-react"

interface LocationMapProps {
  latitude?: number
  longitude?: number
  onLocationSelect: (lat: number, lng: number) => void
}

export function LocationMap({ latitude, longitude, onLocationSelect }: LocationMapProps) {
  const [selectedLat, setSelectedLat] = useState<number | null>(latitude || null)
  const [selectedLng, setSelectedLng] = useState<number | null>(longitude || null)
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const defaultLat = -34.431266198071164
  const defaultLng = -57.26915359497071

  const getCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setSelectedLat(lat)
          setSelectedLng(lng)
          onLocationSelect(lat, lng)

          // Update map view and marker
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 15)
            updateMarker(lat, lng)
          }
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("No se pudo obtener la ubicación actual")
          setIsLoading(false)
        },
      )
    } else {
      alert("La geolocalización no está soportada en este navegador")
      setIsLoading(false)
    }
  }

  const updateMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return

    // Remove existing marker
    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current)
    }

    // Add new marker
    // @ts-ignore - Leaflet will be loaded dynamically
    markerRef.current = window.L.marker([lat, lng], {
      draggable: true,
    }).addTo(mapRef.current)

    // Handle marker drag
    markerRef.current.on("dragend", (e: any) => {
      const position = e.target.getLatLng()
      setSelectedLat(position.lat)
      setSelectedLng(position.lng)
      onLocationSelect(position.lat, position.lng)
    })
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
    const mapElement = document.getElementById("location-map")
    if (!mapElement || !window.L || mapRef.current) return

    const centerLat = defaultLat
    const centerLng = defaultLng

    // @ts-ignore - Leaflet will be loaded dynamically
    mapRef.current = window.L.map("location-map").setView([centerLat, centerLng], 13)

    // Add OpenStreetMap tiles
    // @ts-ignore - Leaflet will be loaded dynamically
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current)

    // Add existing marker if coordinates exist
    if (selectedLat && selectedLng) {
      updateMarker(selectedLat, selectedLng)
    }

    // Handle map clicks
    mapRef.current.on("click", (e: any) => {
      const lat = e.latlng.lat
      const lng = e.latlng.lng

      setSelectedLat(lat)
      setSelectedLng(lng)
      onLocationSelect(lat, lng)
      updateMarker(lat, lng)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Seleccionar Ubicación en el Mapa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Haz clic en el mapa para seleccionar la ubicación exacta</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <Locate className="h-4 w-4" />
            {isLoading ? "Obteniendo..." : "Mi ubicación"}
          </Button>
        </div>

        <div id="location-map" className="w-full h-64 rounded-lg border bg-muted" style={{ minHeight: "300px" }} />

        {selectedLat && selectedLng && (
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Coordenadas seleccionadas:</strong>
            </p>
            <p>Latitud: {selectedLat.toFixed(6)}</p>
            <p>Longitud: {selectedLng.toFixed(6)}</p>
          </div>
        )}
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
