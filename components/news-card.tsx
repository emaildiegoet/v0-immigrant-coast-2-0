import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsCardProps {
  article: any
  featured?: boolean
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const featuredImage =
    article.featured_image || `/placeholder.svg?height=200&width=300&query=noticia+${article.category}`

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${featured ? "ring-2 ring-secondary/20" : ""}`}>
      <div className="relative overflow-hidden rounded-t-lg">
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-secondary text-secondary-foreground">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacada
            </Badge>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary">{getCategoryLabel(article.category)}</Badge>
        </div>

        <Image
          src={featuredImage || "/placeholder.svg"}
          alt={article.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{article.title}</h3>
          {article.excerpt && <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{article.excerpt}</p>}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{article.profiles?.full_name || "Autor"}</span>
          </div>

          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(article.published_at || article.created_at)}</span>
          </div>

          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{article.views_count || 0}</span>
          </div>
        </div>

        <Button asChild className="w-full" size="sm">
          <Link href={`/noticias/${article.slug}`}>Leer Más</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
