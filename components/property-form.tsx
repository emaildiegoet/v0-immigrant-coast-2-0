"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus, UserCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { FileUpload } from "./file-upload"
import { LocationMap } from "./location-map"

interface Seller {
  id: string
  first_name: string
  last_name: string
  whatsapp: string
  email: string | null
  is_active: boolean
}

interface PropertyFormProps {
  property?: any
  onClose: () => void
}

export function PropertyForm({ property, onClose }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || "",
    currency: property?.currency || "USD",
    property_type: property?.property_type || "",
    operation_type: property?.operation_type || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    area_m2: property?.area_m2 || "",
    address: property?.address || "",
    neighborhood: property?.neighborhood || "",
    latitude: property?.latitude || "",
    longitude: property?.longitude || "",
    contact_name: property?.contact_name || "",
    contact_phone: property?.contact_phone || "",
    contact_email: property?.contact_email || "",
    contact_whatsapp: property?.contact_whatsapp || "",
    seller_id: property?.seller_id || "", // Added seller_id field
    is_featured: property?.is_featured || false,
    is_active: property?.is_active ?? true,
  })

  const [amenities, setAmenities] = useState<string[]>(property?.amenities || [])
  const [newAmenity, setNewAmenity] = useState("")
  const [images, setImages] = useState<string[]>(property?.images || [])
  const [sellers, setSellers] = useState<Seller[]>([]) // Added sellers state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingSellers, setIsLoadingSellers] = useState(true) // Added loading state for sellers
  const router = useRouter()

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch("/api/sellers")
        if (response.ok) {
          const sellersData = await response.json()
          setSellers(sellersData.filter((seller: Seller) => seller.is_active))
        } else {
          console.error("Error fetching sellers:", response.statusText)
        }
      } catch (error) {
        console.error("Error fetching sellers:", error)
      } finally {
        setIsLoadingSellers(false)
      }
    }

    fetchSellers()
  }, [])

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      if (!formData.operation_type || formData.operation_type.trim() === "") {
        alert("Por favor selecciona un tipo de operación")
        setIsSubmitting(false)
        return
      }

      if (!formData.property_type || formData.property_type.trim() === "") {
        alert("Por favor selecciona un tipo de propiedad")
        setIsSubmitting(false)
        return
      }

      const latitude = formData.latitude ? Number.parseFloat(formData.latitude) : null
      const longitude = formData.longitude ? Number.parseFloat(formData.longitude) : null

      // Validate latitude range (-90 to 90)
      if (latitude !== null && (latitude < -90 || latitude > 90)) {
        alert("La latitud debe estar entre -90 y 90 grados")
        setIsSubmitting(false)
        return
      }

      // Validate longitude range (-180 to 180)
      if (longitude !== null && (longitude < -180 || longitude > 180)) {
        alert("La longitud debe estar entre -180 y 180 grados")
        setIsSubmitting(false)
        return
      }

      // Validate price is not too large (max 999,999,999)
      const price = Number.parseFloat(formData.price) || 0
      if (price > 999999999) {
        alert("El precio no puede ser mayor a 999,999,999")
        setIsSubmitting(false)
        return
      }

      // Validate area is not too large (max 999,999)
      const area = formData.area_m2 ? Number.parseFloat(formData.area_m2) : null
      if (area !== null && area > 999999) {
        alert("El área no puede ser mayor a 999,999 m²")
        setIsSubmitting(false)
        return
      }

      // Validate bedrooms and bathrooms are reasonable (max 50)
      const bedrooms = formData.bedrooms ? Number.parseInt(formData.bedrooms) : null
      const bathrooms = formData.bathrooms ? Number.parseInt(formData.bathrooms) : null

      if (bedrooms !== null && (bedrooms < 0 || bedrooms > 50)) {
        alert("El número de dormitorios debe estar entre 0 y 50")
        setIsSubmitting(false)
        return
      }

      if (bathrooms !== null && (bathrooms < 0 || bathrooms > 50)) {
        alert("El número de baños debe estar entre 0 y 50")
        setIsSubmitting(false)
        return
      }

      const propertyData = {
        ...formData,
        price,
        bedrooms,
        bathrooms,
        area_m2: area,
        latitude,
        longitude,
        seller_id: formData.seller_id || null, // Include seller_id in property data
        amenities,
        images,
      }

      console.log("[v0] Property data being sent:", propertyData)

      if (property) {
        // Update existing property
        const { error } = await supabase.from("properties").update(propertyData).eq("id", property.id)

        if (error) throw error
      } else {
        // Create new property
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Usuario no autenticado")

        const { error } = await supabase.from("properties").insert({ ...propertyData, created_by: user.id })

        if (error) throw error
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error saving property:", error)
      alert("Error al guardar la propiedad")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity))
  }

  const getSelectedSellerInfo = () => {
    if (!formData.seller_id) return null
    const seller = sellers.find((s) => s.id === formData.seller_id)
    return seller ? `${seller.first_name} ${seller.last_name}` : null
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{property ? "Editar Propiedad" : "Nueva Propiedad"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <div className="flex gap-2">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  max="999999999"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="UYU">UYU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">Tipo de Propiedad *</Label>
              <Select
                value={formData.property_type}
                onValueChange={(value) => setFormData({ ...formData, property_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="quinta">Quinta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operation_type">Tipo de Operación *</Label>
              <Select
                value={formData.operation_type}
                onValueChange={(value) => setFormData({ ...formData, operation_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                  <SelectItem value="alquiler_temporal">Alquiler Temporal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Dormitorios</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                max="50"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Baños</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                max="50"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area_m2">Área (m²)</Label>
              <Input
                id="area_m2"
                type="number"
                min="0"
                max="999999"
                value={formData.area_m2}
                onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Barrio</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller_id" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Vendedor Asignado
            </Label>
            <Select
              value={formData.seller_id}
              onValueChange={(value) => setFormData({ ...formData, seller_id: value })}
              disabled={isLoadingSellers}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoadingSellers ? "Cargando vendedores..." : "Seleccionar vendedor (opcional)"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin vendedor asignado</SelectItem>
                {sellers.map((seller) => (
                  <SelectItem key={seller.id} value={seller.id}>
                    <div className="flex items-center gap-2">
                      <span>
                        {seller.first_name} {seller.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">({seller.whatsapp})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getSelectedSellerInfo() && (
              <p className="text-sm text-muted-foreground">
                Vendedor seleccionado: <span className="font-medium">{getSelectedSellerInfo()}</span>
              </p>
            )}
          </div>

          <LocationMap
            latitude={formData.latitude ? Number.parseFloat(formData.latitude) : undefined}
            longitude={formData.longitude ? Number.parseFloat(formData.longitude) : undefined}
            onLocationSelect={handleLocationSelect}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="-34.9011 (entre -90 y 90)"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="-56.1645 (entre -180 y 180)"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Nombre de Contacto</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="Nombre del contacto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+598 99 123 456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email de Contacto</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="contacto@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_whatsapp">WhatsApp de Contacto</Label>
                <Input
                  id="contact_whatsapp"
                  value={formData.contact_whatsapp}
                  onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                  placeholder="+598 99 123 456"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Si hay un vendedor asignado, su información se mostrará como contacto principal. Esta información de
              contacto se usará como alternativa o información adicional.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Comodidades</Label>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Agregar comodidad"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeAmenity(amenity)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imágenes de la Propiedad</Label>
            <FileUpload images={images} onImagesChange={setImages} maxImages={15} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Activa</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Destacada</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : property ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
