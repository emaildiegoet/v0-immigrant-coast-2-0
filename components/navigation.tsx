"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Building, Wrench, Newspaper, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Propiedades", href: "/propiedades", icon: Building },
    { name: "Servicios", href: "/servicios", icon: Wrench },
    { name: "Noticias", href: "/noticias", icon: Newspaper },
  ]

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-primary group-hover:text-primary/90 transition-colors">
              Costa del Inmigrante 2.0
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {(user.user_metadata?.role === "admin" || user.user_metadata?.role === "moderator") && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">
                      <Settings className="w-4 h-4 mr-1" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={signOut}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="pt-4 border-t space-y-2">
                {user ? (
                  <>
                    {(user.user_metadata?.role === "admin" || user.user_metadata?.role === "moderator") && (
                      <Button asChild variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        Registrarse
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
