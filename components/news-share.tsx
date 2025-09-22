"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Facebook, Twitter, Link2, MessageCircle } from "lucide-react"
import { useState } from "react"

interface NewsShareProps {
  article: any
}

export function NewsShare({ article }: NewsShareProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = `${article.title} - Costa del Inmigrante`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error copying to clipboard:", err)
    }
  }

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    window.open(url, "_blank")
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5" />
          Compartir
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={shareOnWhatsApp} variant="outline" className="w-full bg-transparent" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>

        <Button onClick={shareOnFacebook} variant="outline" className="w-full bg-transparent" size="sm">
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </Button>

        <Button onClick={shareOnTwitter} variant="outline" className="w-full bg-transparent" size="sm">
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>

        <Button onClick={copyToClipboard} variant="outline" className="w-full bg-transparent" size="sm">
          <Link2 className="w-4 h-4 mr-2" />
          {copied ? "¡Copiado!" : "Copiar enlace"}
        </Button>
      </CardContent>
    </Card>
  )
}
