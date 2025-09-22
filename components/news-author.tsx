import { Card, CardContent } from "@/components/ui/card"
import { User, Calendar } from "lucide-react"

interface NewsAuthorProps {
  author: any
  publishedAt: string
}

export function NewsAuthor({ author, publishedAt }: NewsAuthorProps) {
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{author?.full_name || "Autor"}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Publicado el {formatDate(publishedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
