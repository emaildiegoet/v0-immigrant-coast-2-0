"use client"

import { Button } from "@/components/ui/button"
import { Home, Users, FileText, Wrench, Newspaper, Settings, ArrowLeft, UserCheck } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminNavigationProps {
  userRole: string
}

export function AdminNavigation({ userRole }: AdminNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/propiedades", label: "Propiedades", icon: FileText },
    { href: "/admin/servicios", label: "Servicios", icon: Wrench },
    { href: "/admin/vendedores", label: "Vendedores", icon: UserCheck },
    { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users, adminOnly: true },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings, adminOnly: true },
  ]

  const filteredItems = navItems.filter((item) => !item.adminOnly || userRole === "admin")

  return (
    <nav className="space-y-2">
      <Button
        asChild
        variant="outline"
        className="w-full justify-start mb-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
      >
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Sitio
        </Link>
      </Button>

      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Button key={item.href} asChild variant={isActive ? "default" : "ghost"} className="w-full justify-start">
            <Link href={item.href}>
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
