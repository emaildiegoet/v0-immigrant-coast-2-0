"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export function FloatingHomeButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
      >
        <Link href="/" className="flex items-center justify-center w-14 h-14">
          <Home className="w-6 h-6" />
          <span className="sr-only">Volver al inicio</span>
        </Link>
      </Button>
    </div>
  )
}
