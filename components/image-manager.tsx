"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Plus } from "lucide-react"

interface ImageManagerProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  label?: string
  placeholder?: string
}

export function ImageManager({
  images,
  onImagesChange,
  label = "Imágenes",
  placeholder = "URL de imagen",
}: ImageManagerProps) {
  const [newImage, setNewImage] = useState("")

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      onImagesChange([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    onImagesChange(images.filter((i) => i !== image))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addImage()
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" onClick={addImage} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 max-w-xs">
            <span className="truncate">{image}</span>
            <X className="w-3 h-3 cursor-pointer" onClick={() => removeImage(image)} />
          </Badge>
        ))}
      </div>
      {images.length === 0 && <p className="text-sm text-muted-foreground">No hay imágenes agregadas</p>}
    </div>
  )
}
