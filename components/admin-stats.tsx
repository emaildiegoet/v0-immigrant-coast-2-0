import { Card, CardContent } from "@/components/ui/card"
import { Home, Wrench, Newspaper, Users, Star } from "lucide-react"

interface AdminStatsProps {
  stats: {
    properties: number
    services: number
    articles: number
    users: number
    reviews: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      title: "Propiedades",
      value: stats.properties,
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Servicios",
      value: stats.services,
      icon: Wrench,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Artículos",
      value: stats.articles,
      icon: Newspaper,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Usuarios",
      value: stats.users,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Reseñas",
      value: stats.reviews,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Estadísticas Generales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
