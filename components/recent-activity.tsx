import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"

export async function RecentActivity() {
  const supabase = await createClient()

  // Get recent properties
  const { data: recentProperties } = await supabase
    .from("properties")
    .select("id, title, created_at, created_by, profiles:created_by(full_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get recent articles
  const { data: recentArticles } = await supabase
    .from("news_articles")
    .select("id, title, created_at, author_id, profiles:author_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get recent services
  const { data: recentServices } = await supabase
    .from("services")
    .select("id, name, created_at, created_by, profiles:created_by(full_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-UY", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const activities = [
    ...(recentProperties?.map((item) => ({
      id: item.id,
      type: "property" as const,
      title: item.title,
      author: item.profiles?.full_name || "Usuario",
      date: item.created_at,
    })) || []),
    ...(recentArticles?.map((item) => ({
      id: item.id,
      type: "article" as const,
      title: item.title,
      author: item.profiles?.full_name || "Usuario",
      date: item.created_at,
    })) || []),
    ...(recentServices?.map((item) => ({
      id: item.id,
      type: "service" as const,
      title: item.name,
      author: item.profiles?.full_name || "Usuario",
      date: item.created_at,
    })) || []),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  const getTypeLabel = (type: string) => {
    const labels = {
      property: "Propiedad",
      article: "Artículo",
      service: "Servicio",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      property: "bg-primary/10 text-primary",
      article: "bg-blue-100 text-blue-700",
      service: "bg-secondary/10 text-secondary",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge className={getTypeColor(activity.type)}>{getTypeLabel(activity.type)}</Badge>
                  <div>
                    <p className="font-medium line-clamp-1">{activity.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{activity.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(activity.date)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No hay actividad reciente</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
