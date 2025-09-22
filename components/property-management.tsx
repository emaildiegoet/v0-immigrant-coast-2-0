"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Home, User, Calendar, Search, Eye, Star, Trash2, Plus, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PropertyForm } from "./property-form"

interface PropertyManagementProps {
  properties: any[]
}

export function PropertyManagement({ properties: initialProperties }: PropertyManagementProps) {
  const [properties, setProperties] = useState(initialProperties)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const router = useRouter()

  const filteredProperties = properties.filter(
    (property) =>
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    setIsUpdating(propertyId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("properties").update({ is_active: !currentStatus }).eq("id", propertyId)

      if (error) throw error

      setProperties((prev) =>
        prev.map((property) => (property.id === propertyId ? { ...property, is_active: !currentStatus } : property)),
      )

      router.refresh()
    } catch (error) {
      console.error("Error updating property status:", error)
      alert("Error al actualizar el estado de la propiedad")
    } finally {
      setIsUpdating(null)
    }
  }

  const toggleFeaturedStatus = async (propertyId: string, currentStatus: boolean) => {
    setIsUpdating(propertyId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("properties").update({ is_featured: !currentStatus }).eq("id", propertyId)

      if (error) throw error

      setProperties((prev) =>
        prev.map((property) => (property.id === propertyId ? { ...property, is_featured: !currentStatus } : property)),
      )

      router.refresh()
    } catch (error) {
      console.error("Error updating featured status:", error)
      alert("Error al actualizar el estado destacado")
    } finally {
      setIsUpdating(null)
    }
  }

  const deleteProperty = async (propertyId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) return

    setIsUpdating(propertyId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("properties").delete().eq("id", propertyId)

      if (error) throw error

      setProperties((prev) => prev.filter((property) => property.id !== propertyId))

      router.refresh()
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Error al eliminar la propiedad")
    } finally {
      setIsUpdating(null)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: currency === "UYU" ? "UYU" : "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const editProperty = (property: any) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  if (showForm) {
    return <PropertyForm property={editingProperty} onClose={closeForm} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Propiedades ({properties.length})</span>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Propiedad
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar propiedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{property.address}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{property.profiles?.full_name || "Usuario"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(property.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{property.views_count || 0} vistas</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatPrice(property.price, property.currency)}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant={property.is_active ? "default" : "secondary"}>
                        {property.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                      {property.is_featured && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Destacada
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Activa:</label>
                    <Switch
                      checked={property.is_active}
                      onCheckedChange={() => togglePropertyStatus(property.id, property.is_active)}
                      disabled={isUpdating === property.id}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm">Destacada:</label>
                    <Switch
                      checked={property.is_featured}
                      onCheckedChange={() => toggleFeaturedStatus(property.id, property.is_featured)}
                      disabled={isUpdating === property.id}
                    />
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/propiedades/${property.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editProperty(property)}
                    disabled={isUpdating === property.id}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProperty(property.id)}
                    disabled={isUpdating === property.id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron propiedades</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
