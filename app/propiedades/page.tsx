import { createClient } from "@/lib/supabase/server"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilters } from "@/components/property-filters"
import { Pagination } from "@/components/pagination"

interface SearchParams {
  search?: string
  property_type?: string
  operation_type?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  bathrooms?: string
  page?: string
}

export default async function PropertiesPage({
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
  let query = supabase
    .from("properties")
    .select(
      `
      *,
      seller:sellers(
        id,
        first_name,
        last_name,
        whatsapp,
        email,
        description,
        profile_photo
      )
    `,
      { count: "exact" },
    )
    .eq("is_active", true)

  // Apply filters
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,address.ilike.%${params.search}%,description.ilike.%${params.search}%`,
    )
  }

  if (params.property_type) {
    query = query.eq("property_type", params.property_type)
  }

  if (params.operation_type) {
    query = query.eq("operation_type", params.operation_type)
  }

  if (params.min_price) {
    query = query.gte("price", Number.parseFloat(params.min_price))
  }

  if (params.max_price) {
    query = query.lte("price", Number.parseFloat(params.max_price))
  }

  if (params.bedrooms) {
    query = query.gte("bedrooms", Number.parseInt(params.bedrooms))
  }

  if (params.bathrooms) {
    query = query.gte("bathrooms", Number.parseInt(params.bathrooms))
  }

  // Execute query with pagination
  const {
    data: properties,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching properties:", error)
  }

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Propiedades en Costa del Inmigrante</h1>
          <p className="text-muted-foreground">
            {count ? `${count} propiedades encontradas` : "Cargando propiedades..."}
          </p>
        </div>

        <PropertyFilters />

        {properties && properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination currentPage={page} totalPages={totalPages} baseUrl="/propiedades" searchParams={params} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron propiedades que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
