"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FileUpload } from "@/components/file-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Phone, Mail, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Seller {
  id: string
  first_name: string
  last_name: string
  whatsapp: string
  description: string | null
  email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string
    email: string
  }
  profile_photo?: string
}

interface SellerManagementProps {
  sellers: Seller[]
}

export function SellerManagement({ sellers: initialSellers }: SellerManagementProps) {
  const [sellers, setSellers] = useState<Seller[]>(initialSellers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    whatsapp: "",
    description: "",
    email: "",
    is_active: true,
    profile_photo: "",
  })

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      whatsapp: "",
      description: "",
      email: "",
      is_active: true,
      profile_photo: "",
    })
  }

  const handleCreate = async () => {
    if (!formData.first_name || !formData.last_name || !formData.whatsapp) {
      toast({
        title: "Error",
        description: "Nombre, apellido y WhatsApp son obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error creating seller")
      }

      const newSeller = await response.json()
      setSellers([newSeller, ...sellers])
      setIsCreateDialogOpen(false)
      resetForm()
      toast({
        title: "Éxito",
        description: "Vendedor creado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error creating seller",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editingSeller || !formData.first_name || !formData.last_name || !formData.whatsapp) {
      toast({
        title: "Error",
        description: "Nombre, apellido y WhatsApp son obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/sellers/${editingSeller.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error updating seller")
      }

      const updatedSeller = await response.json()
      setSellers(sellers.map((s) => (s.id === editingSeller.id ? updatedSeller : s)))
      setEditingSeller(null)
      resetForm()
      toast({
        title: "Éxito",
        description: "Vendedor actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error updating seller",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (sellerId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/sellers/${sellerId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error deleting seller")
      }

      setSellers(sellers.filter((s) => s.id !== sellerId))
      toast({
        title: "Éxito",
        description: "Vendedor eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error deleting seller",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (seller: Seller) => {
    setEditingSeller(seller)
    setFormData({
      first_name: seller.first_name,
      last_name: seller.last_name,
      whatsapp: seller.whatsapp,
      description: seller.description || "",
      email: seller.email || "",
      is_active: seller.is_active,
      profile_photo: seller.profile_photo || "",
    })
  }

  const closeEditDialog = () => {
    setEditingSeller(null)
    resetForm()
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vendedores</h2>
          <p className="text-muted-foreground">Total: {sellers.length}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Vendedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Vendedor</DialogTitle>
              <DialogDescription>Completa la información del vendedor</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellido *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Pérez"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Foto de Perfil</Label>
                <FileUpload
                  images={formData.profile_photo ? [formData.profile_photo] : []}
                  onImagesChange={(images) => setFormData({ ...formData, profile_photo: images[0] || "" })}
                  maxImages={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+598 99 123 456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Especialista en propiedades costeras..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Vendedor activo</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Vendedor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <Card key={seller.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {seller.profile_photo ? (
                      <img
                        src={seller.profile_photo || "/placeholder.svg"}
                        alt={`${seller.first_name} ${seller.last_name}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {seller.first_name} {seller.last_name}
                    </CardTitle>
                    <CardDescription>Creado: {new Date(seller.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                </div>
                <Badge variant={seller.is_active ? "default" : "secondary"}>
                  {seller.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{seller.whatsapp}</span>
              </div>
              {seller.email && (
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{seller.email}</span>
                </div>
              )}
              {seller.description && <p className="text-sm text-muted-foreground line-clamp-2">{seller.description}</p>}
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(seller)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar vendedor?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El vendedor será eliminado permanentemente.
                        {seller.is_active && " Asegúrate de que no tenga propiedades asignadas."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(seller.id)} disabled={isLoading}>
                        {isLoading ? "Eliminando..." : "Eliminar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSeller} onOpenChange={closeEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Vendedor</DialogTitle>
            <DialogDescription>Modifica la información del vendedor</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">Nombre *</Label>
                <Input
                  id="edit_first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Apellido *</Label>
                <Input
                  id="edit_last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Pérez"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Foto de Perfil</Label>
              <FileUpload
                images={formData.profile_photo ? [formData.profile_photo] : []}
                onImagesChange={(images) => setFormData({ ...formData, profile_photo: images[0] || "" })}
                maxImages={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_whatsapp">WhatsApp *</Label>
              <Input
                id="edit_whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+598 99 123 456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_description">Descripción</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Especialista en propiedades costeras..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit_is_active">Vendedor activo</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeEditDialog}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {sellers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay vendedores</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comienza creando tu primer vendedor para asignar a las propiedades
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Vendedor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
