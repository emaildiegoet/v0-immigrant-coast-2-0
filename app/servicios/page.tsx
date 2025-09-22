import { createClient } from "@/lib/supabase/server"
import { ServiceCard } from "@/components/service-card"
import { ServiceFilters } from "@/components/service-filters"
import { ServiceCategories } from "@/components/service-categories"

interface SearchParams {
  category?: string
  search?: string
  page?: string
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const page = Number.parseInt(params.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  // Build query
  let query = supabase.from("services").select("*", { count: "exact" }).eq("is_active", true)

  // Apply filters
  if (params.category && params.category !== "todos") {
    query = query.eq("category", params.category)
  }

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  // Execute query with pagination
  const {
    data: services,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching services:", error)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Servicios Locales</h1>
          <p className="text-muted-foreground">
            Encuentra profesionales y comercios de confianza en Costa del Inmigrante
          </p>
        </div>

        <ServiceCategories currentCategory={params.category} />
        <ServiceFilters />

        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron servicios que coincidan con tu búsqueda.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {count ? `${count} servicios encontrados` : "Cargando servicios..."}
          </p>
        </div>
      </div>
    </div>
  )
}
