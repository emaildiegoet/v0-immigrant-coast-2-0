"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function NewsEditor() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image: "",
    is_published: false,
    is_featured: false,
  })

  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const categories = [
    { value: "noticias_locales", label: "Noticias Locales" },
    { value: "inmobiliario", label: "Inmobiliario" },
    { value: "comunidad", label: "Comunidad" },
    { value: "eventos", label: "Eventos" },
    { value: "turismo", label: "Turismo" },
    { value: "servicios", label: "Servicios" },
  ]

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
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (isDraft = false) => {
    if (!formData.title || !formData.content || !formData.category) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const articleData = {
        ...formData,
        tags,
        author_id: user.id,
        is_published: isDraft ? false : formData.is_published,
        published_at: formData.is_published && !isDraft ? new Date().toISOString() : null,
      }

      const { data, error } = await supabase.from("news_articles").insert(articleData).select().single()

      if (error) throw error

      router.push(isDraft ? "/admin/noticias" : `/noticias/${data.slug}`)
    } catch (error) {
      console.error("Error creating article:", error)
      alert("Error al crear el artículo")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título de la noticia"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL (slug)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="url-de-la-noticia"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Resumen</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Breve descripción de la noticia"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="featured_image">Imagen destacada (URL)</Label>
            <Input
              id="featured_image"
              value={formData.featured_image}
              onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenido *</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Escribe el contenido completo de la noticia aquí..."
            rows={15}
            className="min-h-[400px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Etiquetas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Agregar etiqueta"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Publicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_published">Publicar inmediatamente</Label>
              <p className="text-sm text-muted-foreground">La noticia será visible para todos los usuarios</p>
            </div>
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_featured">Noticia destacada</Label>
              <p className="text-sm text-muted-foreground">Aparecerá en la sección de noticias destacadas</p>
            </div>
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Guardando..." : formData.is_published ? "Publicar" : "Guardar"}
        </Button>

        <Button onClick={() => handleSubmit(true)} variant="outline" disabled={isSubmitting}>
          <Eye className="w-4 h-4 mr-2" />
          Guardar como Borrador
        </Button>
      </div>
    </div>
  )
}
