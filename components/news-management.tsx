"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FileText, User, Calendar, Search, Eye, Star, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface NewsManagementProps {
  articles: any[]
}

export function NewsManagement({ articles: initialArticles }: NewsManagementProps) {
  const [articles, setArticles] = useState(initialArticles)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  const filteredArticles = articles.filter(
    (article) =>
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const togglePublishedStatus = async (articleId: string, currentStatus: boolean) => {
    setIsUpdating(articleId)
    const supabase = createClient()

    try {
      const updateData = {
        is_published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null,
      }

      const { error } = await supabase.from("news_articles").update(updateData).eq("id", articleId)

      if (error) throw error

      setArticles((prev) =>
        prev.map((article) =>
          article.id === articleId
            ? { ...article, is_published: !currentStatus, published_at: updateData.published_at }
            : article,
        ),
      )

      router.refresh()
    } catch (error) {
      console.error("Error updating article status:", error)
      alert("Error al actualizar el estado del artículo")
    } finally {
      setIsUpdating(null)
    }
  }

  const toggleFeaturedStatus = async (articleId: string, currentStatus: boolean) => {
    setIsUpdating(articleId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("news_articles").update({ is_featured: !currentStatus }).eq("id", articleId)

      if (error) throw error

      setArticles((prev) =>
        prev.map((article) => (article.id === articleId ? { ...article, is_featured: !currentStatus } : article)),
      )

      router.refresh()
    } catch (error) {
      console.error("Error updating featured status:", error)
      alert("Error al actualizar el estado destacado")
    } finally {
      setIsUpdating(null)
    }
  }

  const deleteArticle = async (articleId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) return

    setIsUpdating(articleId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("news_articles").delete().eq("id", articleId)

      if (error) throw error

      setArticles((prev) => prev.filter((article) => article.id !== articleId))

      router.refresh()
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Error al eliminar el artículo")
    } finally {
      setIsUpdating(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Artículos ({articles.length})</span>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/noticias/crear">
                <FileText className="w-4 h-4 mr-2" />
                Nueva Noticia
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/noticias/importar">
                <FileText className="w-4 h-4 mr-2" />
                Importar Noticia
              </Link>
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.profiles?.full_name || "Usuario"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(article.category)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex gap-1 mt-1">
                      <Badge variant={article.is_published ? "default" : "secondary"}>
                        {article.is_published ? "Publicado" : "Borrador"}
                      </Badge>
                      {article.is_featured && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Publicado:</label>
                    <Switch
                      checked={article.is_published}
                      onCheckedChange={() => togglePublishedStatus(article.id, article.is_published)}
                      disabled={isUpdating === article.id}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm">Destacado:</label>
                    <Switch
                      checked={article.is_featured}
                      onCheckedChange={() => toggleFeaturedStatus(article.id, article.is_featured)}
                      disabled={isUpdating === article.id}
                    />
                  </div>

                  {article.is_published && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/noticias/${article.slug}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteArticle(article.id)}
                    disabled={isUpdating === article.id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron artículos</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
