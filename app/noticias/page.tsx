import { createClient } from "@/lib/supabase/server"
import { NewsCard } from "@/components/news-card"
import { NewsFilters } from "@/components/news-filters"
import { NewsCategories } from "@/components/news-categories"
import { FeaturedNews } from "@/components/featured-news"

interface SearchParams {
  category?: string
  search?: string
  page?: string
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const page = Number.parseInt(params.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  // Get featured articles first
  const { data: featuredArticles } = await supabase
    .from("news_articles")
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(3)

  // Build query for regular articles
  let query = supabase
    .from("news_articles")
    .select(
      `
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `,
      { count: "exact" },
    )
    .eq("is_published", true)
    .eq("is_featured", false)

  // Apply filters
  if (params.category && params.category !== "todas") {
    query = query.eq("category", params.category)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%,content.ilike.%${params.search}%`)
  }

  // Execute query with pagination
  const {
    data: articles,
    count,
    error,
  } = await query.order("published_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching articles:", error)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Noticias de Costa del Inmigrante</h1>
          <p className="text-muted-foreground">Mantente informado sobre lo que sucede en nuestra comunidad</p>
        </div>

        {featuredArticles && featuredArticles.length > 0 && <FeaturedNews articles={featuredArticles} />}

        <NewsCategories currentCategory={params.category} />
        <NewsFilters />

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron artículos que coincidan con tu búsqueda.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {count ? `${count} artículos encontrados` : "Cargando artículos..."}
          </p>
        </div>
      </div>
    </div>
  )
}
