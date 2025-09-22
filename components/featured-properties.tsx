import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"

interface FeaturedPropertiesProps {
  properties: any[]
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-6 w-6 text-secondary fill-secondary" />
              <h2 className="text-3xl font-bold text-foreground">Propiedades Destacadas</h2>
            </div>
            <p className="text-muted-foreground">Las mejores opciones seleccionadas especialmente para ti</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/propiedades">Ver Todas</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
