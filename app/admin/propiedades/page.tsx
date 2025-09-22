import { createClient } from "@/lib/supabase/server"
import { PropertyManagement } from "@/components/property-management"
import { redirect } from "next/navigation"

export default async function PropertiesAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has admin permissions
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
    redirect("/admin")
  }

  // Get all properties
  const { data: properties } = await supabase
    .from("properties")
    .select(`
      *,
      profiles:created_by (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Gestión de Propiedades</h1>
          <p className="text-muted-foreground">Modera y administra las propiedades publicadas</p>
        </div>

        <PropertyManagement properties={properties || []} />
      </div>
    </div>
  )
}
