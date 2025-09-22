import { createClient } from "@/lib/supabase/server"
import { AdminStats } from "@/components/admin-stats"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
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

  // Get dashboard statistics
  const [
    { count: propertiesCount },
    { count: servicesCount },
    { count: articlesCount },
    { count: usersCount },
    { count: reviewsCount },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("news_articles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("service_reviews").select("*", { count: "exact", head: true }),
  ])

  const stats = {
    properties: propertiesCount || 0,
    services: servicesCount || 0,
    articles: articlesCount || 0,
    users: usersCount || 0,
    reviews: reviewsCount || 0,
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona el contenido y usuarios de Costa del Inmigrante</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AdminStats stats={stats} />
            <RecentActivity />
          </div>

          <div>
            <QuickActions userRole={profile.role} />
          </div>
        </div>
      </div>
    </div>
  )
}
