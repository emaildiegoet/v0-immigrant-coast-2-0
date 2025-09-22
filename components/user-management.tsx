"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { User, Mail, Calendar, Shield, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserManagementProps {
  users: any[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateUserRole = async (userId: string, newRole: string) => {
    setIsUpdating(userId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      router.refresh()
    } catch (error) {
      console.error("Error updating user role:", error)
      alert("Error al actualizar el rol del usuario")
    } finally {
      setIsUpdating(null)
    }
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      user: "Usuario",
      moderator: "Moderador",
      admin: "Administrador",
    }
    return labels[role as keyof typeof labels] || role
  }

  const getRoleColor = (role: string) => {
    const colors = {
      user: "bg-gray-100 text-gray-700",
      moderator: "bg-blue-100 text-blue-700",
      admin: "bg-red-100 text-red-700",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Usuarios Registrados ({users.length})</span>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{user.full_name || "Sin nombre"}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getRoleColor(user.role || "user")}>
                    <Shield className="w-3 h-3 mr-1" />
                    {getRoleLabel(user.role || "user")}
                  </Badge>

                  <Select
                    value={user.role || "user"}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                    disabled={isUpdating === user.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="moderator">Moderador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
