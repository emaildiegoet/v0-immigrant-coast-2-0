import { createClient } from "@/lib/supabase/server"
import { PropertyCard } from "@/components/property-card"
import { Hero } from "@/components/hero"
import { FeaturedProperties } from "@/components/featured-properties"
import { FeaturedServices } from "@/components/featured-services"
import { LatestNews } from "@/components/latest-news"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  // Get featured properties
  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6)

  // Get recent properties
  const { data: recentProperties } = await supabase
    .from("properties")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Get top-rated services
  const { data: topServices } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("average_rating", { ascending: false })
    .limit(6)

  // Get latest news
  const { data: latestNews } = await supabase
    .from("news_articles")
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(4)

  return (
    <div className="min-h-screen">
      <Hero />

      {featuredProperties && featuredProperties.length > 0 && <FeaturedProperties properties={featuredProperties} />}

      {topServices && topServices.length > 0 && <FeaturedServices services={topServices} />}

      {latestNews && latestNews.length > 0 && <LatestNews articles={latestNews} />}

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Propiedades Recientes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre las últimas propiedades disponibles en Costa del Inmigrante
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentProperties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <footer className="bg-muted/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm mb-4">
            © 2024 Costa del Inmigrante. Todos los derechos reservados.
          </p>
          <Link
            href="/auth/login"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Administración
          </Link>
        </div>
      </footer>
    </div>
  )
}
