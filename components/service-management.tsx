"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Wrench, User, Calendar, Search, Eye, Star, Trash2, Plus, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ServiceManagementProps {
  services: any[]
}

export function ServiceManagement({ services: initialServices }: ServiceManagementProps) {
  const [services, setServices] = useState(initialServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    setIsUpdating(serviceId)
    const supabase = createClient()

    try {
      console.log("[v0] Updating service status:", { serviceId, currentStatus, newStatus: !currentStatus })

      const { error } = await supabase.from("services").update({ is_active: !currentStatus }).eq("id", serviceId)

      if (error) {
        console.error("[v0] Error updating service status:", error)
        throw error
      }

      setServices((prev) =>
        prev.map((service) => (service.id === serviceId ? { ...service, is_active: !currentStatus } : service)),
      )

      console.log("[v0] Service status updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error updating service status:", error)
      alert("Error al actualizar el estado del servicio")
    } finally {
      setIsUpdating(null)
    }
  }

  const toggleFeaturedStatus = async (serviceId: string, currentStatus: boolean) => {
    setIsUpdating(serviceId)
    const supabase = createClient()

    try {
      console.log("[v0] Updating featured status:", { serviceId, currentStatus, newStatus: !currentStatus })

      const { error } = await supabase.from("services").update({ is_featured: !currentStatus }).eq("id", serviceId)

      if (error) {
        console.error("[v0] Error updating featured status:", error)
        throw error
      }

      setServices((prev) =>
        prev.map((service) => (service.id === serviceId ? { ...service, is_featured: !currentStatus } : service)),
      )

      console.log("[v0] Featured status updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error updating featured status:", error)
      alert("Error al actualizar el estado destacado")
    } finally {
      setIsUpdating(null)
    }
  }

  const deleteService = async (serviceId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este servicio?")) return

    setIsUpdating(serviceId)

    try {
      console.log("[v0] Deleting service:", serviceId)

      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar el servicio")
      }

      const result = await response.json()
      console.log("[v0] Service deleted successfully:", result)

      // Update local state
      setServices((prev) => prev.filter((service) => service.id !== serviceId))

      console.log("[v0] Service removed from local state")
      alert("Servicio eliminado correctamente")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting service:", error)
      alert(`Error al eliminar el servicio: ${error.message || "Error desconocido"}`)
    } finally {
      setIsUpdating(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      construccion: "Construcción",
      limpieza: "Limpieza",
      jardineria: "Jardinería",
      plomeria: "Plomería",
      electricidad: "Electricidad",
      pintura: "Pintura",
      carpinteria: "Carpintería",
      otros: "Otros",
    }
    return labels[category as keyof typeof labels] || category
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Servicios ({services.length})</span>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/admin/servicios/crear">
                <Plus className="w-4 h-4 mr-2" />
                Crear Servicio
              </Link>
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar servicios..."
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
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{service.profiles?.full_name || "Usuario"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(service.created_at)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(service.category)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex gap-1 mt-1">
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                      {service.is_featured && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Activo:</label>
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={() => toggleServiceStatus(service.id, service.is_active)}
                      disabled={isUpdating === service.id}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm">Destacado:</label>
                    <Switch
                      checked={service.is_featured}
                      onCheckedChange={() => toggleFeaturedStatus(service.id, service.is_featured)}
                      disabled={isUpdating === service.id}
                    />
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/servicios/${service.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/servicios/editar/${service.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteService(service.id)}
                    disabled={isUpdating === service.id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron servicios</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
