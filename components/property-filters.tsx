"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    property_type: searchParams.get("property_type") || "Todos",
    transaction_type: searchParams.get("transaction_type") || "Todas",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "Cualquiera",
    bathrooms: searchParams.get("bathrooms") || "Cualquiera",
  })

  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    router.push(`/propiedades?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      property_type: "Todos",
      transaction_type: "Todas",
      min_price: "",
      max_price: "",
      bedrooms: "Cualquiera",
      bathrooms: "Cualquiera",
    })
    router.push("/propiedades")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título, ubicación..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter toggle */}
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>

          {/* Quick filters for desktop */}
          <div className="hidden lg:flex gap-2">
            <Select
              value={filters.transaction_type}
              onValueChange={(value) => handleFilterChange("transaction_type", value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Operación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="alquiler">Alquiler</SelectItem>
                <SelectItem value="alquiler_temporal">Alquiler Temporal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.property_type} onValueChange={(value) => handleFilterChange("property_type", value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="quinta">Quinta</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={applyFilters}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="transaction_type">Operación</Label>
                <Select
                  value={filters.transaction_type}
                  onValueChange={(value) => handleFilterChange("transaction_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas</SelectItem>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                    <SelectItem value="alquiler_temporal">Alquiler Temporal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="property_type">Tipo de Propiedad</Label>
                <Select
                  value={filters.property_type}
                  onValueChange={(value) => handleFilterChange("property_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="quinta">Quinta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="min_price">Precio Mínimo</Label>
                <Input
                  id="min_price"
                  type="number"
                  placeholder="0"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange("min_price", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="max_price">Precio Máximo</Label>
                <Input
                  id="max_price"
                  type="number"
                  placeholder="Sin límite"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange("max_price", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bedrooms">Dormitorios</Label>
                <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cualquiera">Cualquiera</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bathrooms">Baños</Label>
                <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange("bathrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cualquiera">Cualquiera</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={applyFilters} className="flex-1 md:flex-none">
                <Search className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
