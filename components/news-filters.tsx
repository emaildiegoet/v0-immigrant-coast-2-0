"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function NewsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")

  const applySearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    params.delete("page") // Reset to first page
    router.push(`/noticias?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearch("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.delete("page")
    router.push(`/noticias?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applySearch()
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar noticias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={applySearch}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
          {search && (
            <Button variant="outline" onClick={clearSearch}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
