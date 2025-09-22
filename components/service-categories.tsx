import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Wrench,
  Droplets,
  Hammer,
  Paintbrush,
  Scissors,
  Sparkles,
  Building,
  Car,
  Heart,
  Stethoscope,
  Scale,
  Calculator,
  UtensilsCrossed,
  ShoppingCart,
  Cross,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

interface ServiceCategoriesProps {
  currentCategory?: string
}

const categories = [
  { key: "todos", label: "Todos", icon: MoreHorizontal },
  { key: "electricista", label: "Electricistas", icon: Wrench },
  { key: "plomero", label: "Plomeros", icon: Droplets },
  { key: "carpintero", label: "Carpinteros", icon: Hammer },
  { key: "pintor", label: "Pintores", icon: Paintbrush },
  { key: "jardinero", label: "Jardineros", icon: Scissors },
  { key: "limpieza", label: "Limpieza", icon: Sparkles },
  { key: "construccion", label: "Construcción", icon: Building },
  { key: "mecanico", label: "Mecánicos", icon: Car },
  { key: "veterinario", label: "Veterinarios", icon: Heart },
  { key: "medico", label: "Médicos", icon: Stethoscope },
  { key: "abogado", label: "Abogados", icon: Scale },
  { key: "contador", label: "Contadores", icon: Calculator },
  { key: "restaurante", label: "Restaurantes", icon: UtensilsCrossed },
  { key: "supermercado", label: "Supermercados", icon: ShoppingCart },
  { key: "farmacia", label: "Farmacias", icon: Cross },
  { key: "otro", label: "Otros", icon: MoreHorizontal },
]

export function ServiceCategories({ currentCategory = "todos" }: ServiceCategoriesProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
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
                <Link href={`/servicios?category=${category.key}`}>
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
