import { Button } from "@/components/ui/button"
import { Search, MapPin, Home } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Costa del <span className="text-primary">Inmigrante</span>
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance max-w-3xl mx-auto">
          Tu hogar en la costa uruguaya te está esperando. Descubre propiedades únicas y servicios locales en nuestra
          hermosa comunidad.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href="/propiedades">
              <Home className="mr-2 h-5 w-5" />
              Ver Propiedades
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[200px] bg-transparent">
            <Link href="/servicios">
              <Search className="mr-2 h-5 w-5" />
              Explorar Servicios
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Propiedades Únicas</h3>
            <p className="text-muted-foreground">Casas, apartamentos y terrenos en la mejor ubicación costera</p>
          </div>

          <div className="text-center">
            <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ubicación Privilegiada</h3>
            <p className="text-muted-foreground">A metros del río y con acceso a todos los servicios</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Servicios Locales</h3>
            <p className="text-muted-foreground">Conecta con profesionales y comercios de la zona</p>
          </div>
        </div>
      </div>
    </section>
  )
}
