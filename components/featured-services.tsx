import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"

interface FeaturedServicesProps {
  services: any[]
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-6 w-6 text-secondary fill-secondary" />
              <h2 className="text-3xl font-bold text-foreground">Servicios Mejor Valorados</h2>
            </div>
            <p className="text-muted-foreground">Profesionales y comercios de confianza en tu comunidad</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/servicios">Ver Todos</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
