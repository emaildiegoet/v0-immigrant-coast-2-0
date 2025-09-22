"use client"

import type React from "react"
import { LocationMap } from "./location-map"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { FileUpload } from "./file-upload"

interface ServiceFormProps {
  initialData?: any
  isEditing?: boolean
  onClose?: () => void
}

export function ServiceForm({ initialData, isEditing = false, onClose }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    contact_name: initialData?.contact_name || "",
    contact_phone: initialData?.contact_phone || "",
    contact_whatsapp: initialData?.contact_whatsapp || "",
    address: initialData?.address || initialData?.ciudad || "",
    latitude: initialData?.latitude?.toString() || "",
    longitude: initialData?.longitude?.toString() || "",
    is_active: initialData?.is_active ?? true,
  })

  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [workingHours, setWorkingHours] = useState(initialData?.working_hours || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      console.log("[v0] Submitting service form:", { formData, isEditing, serviceId: initialData?.id })

      // Validate required fields
      if (!formData.name.trim()) {
        alert("Por favor ingresa el nombre del servicio")
        setIsSubmitting(false)
        return
      }

      if (!formData.category) {
        alert("Por favor selecciona una categoría")
        setIsSubmitting(false)
        return
      }

      if (!formData.contact_name.trim()) {
        alert("Por favor ingresa el nombre de contacto")
        setIsSubmitting(false)
        return
      }

      // Validate coordinates if provided
      const latitude = formData.latitude ? Number.parseFloat(formData.latitude) : null
      const longitude = formData.longitude ? Number.parseFloat(formData.longitude) : null

      if (latitude !== null && (latitude < -90 || latitude > 90)) {
        alert("La latitud debe estar entre -90 y 90 grados")
        setIsSubmitting(false)
        return
      }

      if (longitude !== null && (longitude < -180 || longitude > 180)) {
        alert("La longitud debe estar entre -180 y 180 grados")
        setIsSubmitting(false)
        return
      }

      const categoryMapping = {
        jardineria: "construccion",
        plomeria: "construccion",
        electricidad: "construccion",
        pintura: "construccion",
        carpinteria: "construccion",
        mecanico: "construccion",
        veterinario: "restaurante",
        medico: "restaurante",
        abogado: "restaurante",
        contador: "restaurante",
        profesor: "restaurante",
      }

      const mappedCategory = categoryMapping[formData.category] || formData.category
      console.log("[v0] Mapping category from", formData.category, "to", mappedCategory)

      const serviceData = {
        ...formData,
        category: mappedCategory, // Use mapped category
        latitude,
        longitude,
        images,
        working_hours: workingHours,
      }

      if (isEditing && initialData?.id) {
        console.log("[v0] Updating service:", initialData.id)
        const { error } = await supabase.from("services").update(serviceData).eq("id", initialData.id)

        if (error) {
          console.error("[v0] Error updating service:", error)
          throw error
        }
        console.log("[v0] Service updated successfully")
      } else {
        console.log("[v0] Creating new service")
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Usuario no autenticado")

        const { error } = await supabase.from("services").insert({ ...serviceData, created_by: user.id })

        if (error) {
          console.error("[v0] Error creating service:", error)
          throw error
        }
        console.log("[v0] Service created successfully")
      }

      alert(isEditing ? "Servicio actualizado correctamente" : "Servicio creado correctamente")
      router.push("/admin/servicios")
      router.refresh()

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("[v0] Error saving service:", error)
      alert(`Error al ${isEditing ? "actualizar" : "guardar"} el servicio: ${error.message || "Error desconocido"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: "construccion", label: "Construcción" },
    { value: "limpieza", label: "Limpieza" },
    { value: "jardineria", label: "Jardinería" },
    { value: "plomeria", label: "Plomería" },
    { value: "electricidad", label: "Electricidad" },
    { value: "pintura", label: "Pintura" },
    { value: "carpinteria", label: "Carpintería" },
    { value: "mecanico", label: "Mecánico" },
    { value: "veterinario", label: "Veterinario" },
    { value: "medico", label: "Médico" },
    { value: "abogado", label: "Abogado" },
    { value: "contador", label: "Contador" },
    { value: "profesor", label: "Profesor" },
    { value: "restaurante", label: "Restaurante" },
    { value: "supermercado", label: "Supermercado" },
    { value: "farmacia", label: "Farmacia" },
    { value: "otros", label: "Otros" },
  ]

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Servicio" : "Nuevo Servicio"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Servicio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name">Nombre de Contacto *</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_whatsapp">WhatsApp</Label>
              <Input
                id="contact_whatsapp"
                value={formData.contact_whatsapp}
                onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
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
            <Label htmlFor="address">Ciudad</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ej: Montevideo, Punta del Este, etc."
            />
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

          <div className="space-y-2">
            <Label>Imágenes del Servicio</Label>
            <FileUpload images={images} onImagesChange={setImages} maxImages={8} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Activo</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (onClose) {
                  onClose()
                } else {
                  router.push("/admin/servicios")
                }
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
