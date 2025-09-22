import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import { Newspaper } from "lucide-react"
import Link from "next/link"

interface LatestNewsProps {
  articles: any[]
}

export function LatestNews({ articles }: LatestNewsProps) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Últimas Noticias</h2>
            </div>
            <p className="text-muted-foreground">Mantente informado sobre lo que sucede en nuestra comunidad</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/noticias">Ver Todas</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
