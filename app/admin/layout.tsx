import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { AdminNavigation } from "@/components/admin-navigation"
import { redirect } from "next/navigation"
import { Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 min-h-screen bg-card border-r border-border p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground">Panel Admin</h2>
            <p className="text-sm text-muted-foreground">Costa del Inmigrante</p>
          </div>

          <div className="mb-6">
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Volver al Inicio
              </Link>
            </Button>
          </div>

          <AdminNavigation userRole={profile.role} />
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
