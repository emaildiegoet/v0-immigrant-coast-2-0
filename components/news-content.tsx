import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, Tag } from "lucide-react"
import Image from "next/image"

interface NewsContentProps {
  article: any
}

export function NewsContent({ article }: NewsContentProps) {
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          {getCategoryLabel(article.category)}
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{article.title}</h1>

        {article.excerpt && (
          <p className="text-xl text-muted-foreground mb-6 text-balance max-w-3xl mx-auto">{article.excerpt}</p>
        )}

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{article.profiles?.full_name || "Autor"}</span>
          </div>

          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(article.published_at || article.created_at)}</span>
          </div>

          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            <span>{article.views_count || 0} vistas</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image src={article.featured_image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div
          className="text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br>") }}
        />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="pt-6 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Etiquetas:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
