"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ServiceReviewsProps {
  serviceId: string
  reviews: any[]
}

export function ServiceReviews({ serviceId, reviews }: ServiceReviewsProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const router = useRouter()

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < currentRating ? "text-secondary fill-secondary" : "text-muted-foreground hover:text-secondary"
        }`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ))
  }

  const handleSubmitReview = async () => {
    if (!rating) return

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

      const { error } = await supabase.from("reviews").insert({
        service_id: serviceId,
        user_id: user.id,
        rating,
        comment: comment.trim() || null,
      })

      if (error) throw error

      // Reset form
      setRating(0)
      setComment("")
      setShowReviewForm(false)

      // Refresh the page to show new review
      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reseñas ({reviews.length})
          </CardTitle>

          {!showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)} variant="outline">
              Escribir Reseña
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Review Form */}
        {showReviewForm && (
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold mb-4">Escribir una reseña</h4>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Calificación</label>
                <div className="flex items-center gap-1">{renderStars(rating, true)}</div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Comentario (opcional)</label>
                <Textarea
                  placeholder="Comparte tu experiencia con este servicio..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitReview} disabled={!rating || isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false)
                    setRating(0)
                    setComment("")
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{review.profiles?.full_name || "Usuario"}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(review.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                </div>

                {review.comment && <p className="text-muted-foreground leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aún no hay reseñas para este servicio.</p>
            <p className="text-sm text-muted-foreground">¡Sé el primero en compartir tu experiencia!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
