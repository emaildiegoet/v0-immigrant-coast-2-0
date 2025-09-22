import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RelatedNewsProps {
  articles: any[]
  currentCategory: string
}

export function RelatedNews({ articles, currentCategory }: RelatedNewsProps) {
  const getCategoryLabel = (category: string) => {
    const labels = {
      noticias_locales: "Noticias Locales",
      inmobiliario: "Inmobiliario",
      comunidad: "Comunidad",
      eventos: "Eventos",
      turismo: "Turismo",
      servicios: "Servicios",
    }
    return labels[category as keyof typeof labels] || category
  }

  return (
    <section className="py-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Más de {getCategoryLabel(currentCategory)}</h2>
        <Button asChild variant="outline">
          <Link href={`/noticias?category=${currentCategory}`}>Ver Todas</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
