"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface ExtractedContent {
  title: string
  content: string
  excerpt: string
  image?: string
  publishedDate?: string
  author?: string
  sourceUrl: string
}

export function NewsImporter() {
  const [url, setUrl] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [editedContent, setEditedContent] = useState<Partial<ExtractedContent>>({})
  const [category, setCategory] = useState<string>("")
  const [tags, setTags] = useState<string>("")
  const router = useRouter()

  const handleExtractContent = async () => {
    if (!url.trim()) return

    setIsExtracting(true)
    try {
      const response = await fetch("/api/extract-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        throw new Error("Error al extraer el contenido")
      }

      const data = await response.json()
      setExtractedContent(data)
      setEditedContent(data)
    } catch (error) {
      console.error("Error:", error)
      alert("Error al extraer el contenido de la URL")
    } finally {
      setIsExtracting(false)
    }
  }

  const handlePublishNews = async () => {
    if (!extractedContent || !category) return

    setIsPublishing(true)
    try {
      const newsData = {
        title: editedContent.title || extractedContent.title,
        content: editedContent.content || extractedContent.content,
        excerpt: editedContent.excerpt || extractedContent.excerpt,
        featured_image: editedContent.image || extractedContent.image,
        category,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        source_url: extractedContent.sourceUrl,
        is_published: false, // Save as draft initially
      }

      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      })

      if (!response.ok) {
        throw new Error("Error al crear la noticia")
      }

      alert("Noticia creada exitosamente como borrador")
      router.push("/admin/noticias")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear la noticia")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Extraer Contenido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url">URL de la noticia</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="url"
                type="url"
                placeholder="https://ejemplo.com/noticia"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isExtracting}
              />
              <Button onClick={handleExtractContent} disabled={!url.trim() || isExtracting}>
                {isExtracting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Extrayendo...
                  </>
                ) : (
                  "Extraer"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Content Preview */}
      {extractedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Contenido Extraído
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={editedContent.title || ""}
                onChange={(e) => setEditedContent((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Resumen</Label>
              <Textarea
                id="excerpt"
                value={editedContent.excerpt || ""}
                onChange={(e) => setEditedContent((prev) => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={editedContent.content || ""}
                onChange={(e) => setEditedContent((prev) => ({ ...prev, content: e.target.value }))}
                rows={10}
                className="mt-2"
              />
            </div>

            {extractedContent.image && (
              <div>
                <Label>Imagen destacada</Label>
                <div className="mt-2">
                  <img
                    src={extractedContent.image || "/placeholder.svg"}
                    alt="Imagen de la noticia"
                    className="max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="inmobiliario">Inmobiliario</SelectItem>
                    <SelectItem value="servicios">Servicios</SelectItem>
                    <SelectItem value="eventos">Eventos</SelectItem>
                    <SelectItem value="turismo">Turismo</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="etiqueta1, etiqueta2, etiqueta3"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Fuente</Badge>
              <a
                href={extractedContent.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {extractedContent.sourceUrl}
              </a>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handlePublishNews} disabled={!category || isPublishing}>
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear Noticia"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setExtractedContent(null)
                  setEditedContent({})
                  setUrl("")
                  setCategory("")
                  setTags("")
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
