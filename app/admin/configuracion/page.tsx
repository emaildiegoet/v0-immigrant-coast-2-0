import { createClient } from "@/lib/supabase/server"
import { SiteConfiguration } from "@/components/site-configuration"
import { redirect } from "next/navigation"

export default async function ConfigurationPage() {
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

  // Get site configuration
  const { data: config, error: configError } = await supabase.from("site_config").select("*").order("key")

  if (configError) {
    console.error("[v0] Error fetching site config:", configError)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Configuración del Sitio</h1>
          <p className="text-muted-foreground">Administra la configuración general de Costa del Inmigrante</p>
        </div>

        {configError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium mb-2">Error de Configuración</h3>
            <p className="text-red-700 text-sm">
              No se pudo cargar la configuración del sitio. Asegúrate de que la tabla site_config existe en la base de
              datos.
            </p>
            <p className="text-red-600 text-xs mt-2">Error: {configError.message}</p>
          </div>
        ) : (
          <SiteConfiguration config={config || []} />
        )}
      </div>
    </div>
  )
}
