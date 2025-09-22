import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Users, BarChart3, FileText, Wrench } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  userRole: string
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const actions = [
    {
      title: "Nueva Noticia",
      description: "Crear un nuevo artículo",
      icon: Plus,
      href: "/noticias/crear",
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "Gestionar Usuarios",
      description: "Administrar perfiles",
      icon: Users,
      href: "/admin/usuarios",
      color: "bg-secondary text-secondary-foreground",
      adminOnly: true,
    },
    {
      title: "Propiedades",
      description: "Moderar propiedades",
      icon: FileText,
      href: "/admin/propiedades",
      color: "bg-blue-600 text-white",
    },
    {
      title: "Servicios",
      description: "Gestionar servicios",
      icon: Wrench,
      href: "/admin/servicios",
      color: "bg-green-600 text-white",
    },
    {
      title: "Noticias",
      description: "Gestionar artículos",
      icon: FileText,
      href: "/admin/noticias",
      color: "bg-orange-600 text-white",
    },
    {
      title: "Configuración",
      description: "Ajustes del sitio",
      icon: Settings,
      href: "/admin/configuracion",
      color: "bg-gray-600 text-white",
      adminOnly: true,
    },
    {
      title: "Estadísticas",
      description: "Ver métricas",
      icon: BarChart3,
      href: "/admin/estadisticas",
      color: "bg-purple-600 text-white",
    },
  ]

  const filteredActions = actions.filter((action) => !action.adminOnly || userRole === "admin")

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredActions.map((action) => {
          const Icon = action.icon
          return (
            <Button key={action.title} asChild className={`w-full justify-start h-auto p-4 ${action.color}`}>
              <Link href={action.href}>
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
