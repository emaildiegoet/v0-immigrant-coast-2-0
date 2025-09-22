import { createClient } from "@/lib/supabase/server"
import { NewsManagement } from "@/components/news-management"
import { redirect } from "next/navigation"

export default async function NewsAdminPage() {
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

  // Get all news articles
  const { data: articles } = await supabase
    .from("news_articles")
    .select(`
      *,
      profiles:author_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Gestión de Noticias</h1>
          <p className="text-muted-foreground">Modera y administra los artículos publicados</p>
        </div>

        <NewsManagement articles={articles || []} />
      </div>
    </div>
  )
}
