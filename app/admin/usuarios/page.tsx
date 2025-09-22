import { createClient } from "@/lib/supabase/server"
import { UserManagement } from "@/components/user-management"
import { redirect } from "next/navigation"

export default async function UsersAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has admin permissions
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/admin")
  }

  // Get all users
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los perfiles y roles de los usuarios</p>
        </div>

        <UserManagement users={users || []} />
      </div>
    </div>
  )
}
