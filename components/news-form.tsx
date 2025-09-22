"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { FileUpload } from "./file-upload"

interface NewsFormProps {
  news?: any
  onClose: () => void
}

export function NewsForm({ news, onClose }: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: news?.title || "",
    slug: news?.slug || "",
    excerpt: news?.excerpt || "",
    content: news?.content || "",
    category: news?.category || "",
    is_published: news?.is_published ?? false,
    is_featured: news?.is_featured ?? false,
    published_at: news?.published_at ? new Date(news.published_at).toISOString().slice(0, 16) : "",
  })

  const [tags, setTags] = useState<string[]>(news?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [images, setImages] = useState<string[]>(news?.images || (news?.featured_image ? [news.featured_image] : []))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      const newsData = {
        ...formData,
        tags,
        images,
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null,
      }

      if (news) {
        // Update existing news
        const { error } = await supabase.from("news_articles").update(newsData).eq("id", news.id)

        if (error) throw error
      } else {
        // Create new news
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Usuario no autenticado")

        const { error } = await supabase.from("news_articles").insert({ ...newsData, author_id: user.id })

        if (error) throw error
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error saving news:", error)
      alert("Error al guardar la noticia")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const categories = [
    { value: "local", label: "Local" },
    { value: "inmobiliario", label: "Inmobiliario" },
    { value: "servicios", label: "Servicios" },
    { value: "eventos", label: "Eventos" },
    { value: "turismo", label: "Turismo" },
    { value: "general", label: "General" },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{news ? "Editar Noticia" : "Nueva Noticia"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="published_at">Fecha de Publicación</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumen</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label>Imágenes de la Noticia</Label>
            <FileUpload images={images} onImagesChange={setImages} maxImages={10} />
          </div>

          <div className="space-y-2">
            <Label>Etiquetas</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Agregar etiqueta"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="is_published">Publicada</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Destacada</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : news ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
