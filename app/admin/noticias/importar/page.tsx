import { createClient } from "@/lib/supabase/server"
import { NewsImporter } from "@/components/news-importer"
import { redirect } from "next/navigation"

export default async function NewsImportPage() {
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Importar Noticia</h1>
          <p className="text-muted-foreground">Genera una noticia a partir de una URL de otro portal</p>
        </div>

        <NewsImporter />
      </div>
    </div>
  )
}
