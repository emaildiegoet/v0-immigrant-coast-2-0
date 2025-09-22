import { NewsCard } from "@/components/news-card"
import { Star } from "lucide-react"

interface FeaturedNewsProps {
  articles: any[]
}

export function FeaturedNews({ articles }: FeaturedNewsProps) {
  return (
    <section className="py-8 px-4 bg-muted/30 rounded-lg mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-6 w-6 text-secondary fill-secondary" />
              <h2 className="text-2xl font-bold text-foreground">Noticias Destacadas</h2>
            </div>
            <p className="text-muted-foreground">Las historias más importantes de nuestra comunidad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
