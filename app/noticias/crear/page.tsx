import { createClient } from "@/lib/supabase/server"
import { NewsEditor } from "@/components/news-editor"
import { redirect } from "next/navigation"

export default async function CreateNewsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has permission to create articles
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
    redirect("/")
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Crear Nueva Noticia</h1>
          <p className="text-muted-foreground">
            Comparte información importante con la comunidad de Costa del Inmigrante
          </p>
        </div>

        <NewsEditor />
      </div>
    </div>
  )
}
