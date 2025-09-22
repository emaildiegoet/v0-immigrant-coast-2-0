"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function FileUpload({ images, onImagesChange, maxImages = 10 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      alert(`Solo puedes subir un máximo de ${maxImages} imágenes`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir las imágenes")
      }

      const { urls } = await response.json()
      onImagesChange([...images, ...urls])
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Error al subir las imágenes")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Subiendo..." : "Subir Imágenes"}
        </Button>
        <span className="text-sm text-muted-foreground">
          {images.length}/{maxImages} imágenes
        </span>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                <Image src={url || "/placeholder.svg"} alt={`Imagen ${index + 1}`} fill className="object-cover" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
