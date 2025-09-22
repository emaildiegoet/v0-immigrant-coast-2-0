import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { FloatingHomeButton } from "@/components/floating-home-button"
import "./globals.css"

export const metadata: Metadata = {
  title: "Costa del Inmigrante 2.0",
  description: "Plataforma inmobiliaria y de servicios para la costa uruguaya",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navigation />
        <Suspense fallback={null}>{children}</Suspense>
        <FloatingHomeButton />
        <Analytics />
      </body>
    </html>
  )
}
