import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Newspaper, Home, Users, Calendar, Camera, Wrench, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface NewsCategoriesProps {
  currentCategory?: string
}

const categories = [
  { key: "todas", label: "Todas", icon: MoreHorizontal },
  { key: "noticias_locales", label: "Noticias Locales", icon: Newspaper },
  { key: "inmobiliario", label: "Inmobiliario", icon: Home },
  { key: "comunidad", label: "Comunidad", icon: Users },
  { key: "eventos", label: "Eventos", icon: Calendar },
  { key: "turismo", label: "Turismo", icon: Camera },
  { key: "servicios", label: "Servicios", icon: Wrench },
]

export function NewsCategories({ currentCategory = "todas" }: NewsCategoriesProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = currentCategory === category.key

            return (
              <Button
                key={category.key}
                asChild
                variant={isActive ? "default" : "outline"}
                className="h-auto p-3 flex flex-col gap-2"
              >
                <Link href={`/noticias?category=${category.key}`}>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs text-center leading-tight">{category.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
