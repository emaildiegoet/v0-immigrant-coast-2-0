"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ServiceGalleryProps {
  images: string[]
  name: string
}

export function ServiceGallery({ images, name }: ServiceGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const displayImages = images.length > 0 ? images : [`/placeholder.svg?height=400&width=600&query=servicio+${name}`]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={displayImages[currentImage] || "/placeholder.svg"}
            alt={`${name} - Imagen ${currentImage + 1}`}
            fill
            className="object-cover"
          />

          {displayImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon" className="absolute top-4 right-4">
                <Expand className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="aspect-video relative">
                <Image
                  src={displayImages[currentImage] || "/placeholder.svg"}
                  alt={`${name} - Imagen ${currentImage + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/50 rounded-full px-3 py-1 text-white text-sm">
                {currentImage + 1} / {displayImages.length}
              </div>
            </div>
          )}
        </div>

        {displayImages.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  index === currentImage ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={image || "/placeholder.svg"} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
