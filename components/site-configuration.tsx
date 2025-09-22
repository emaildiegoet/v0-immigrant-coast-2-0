"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SiteConfigurationProps {
  config: any[]
}

export function SiteConfiguration({ config: initialConfig }: SiteConfigurationProps) {
  const [config, setConfig] = useState(() => {
    const configMap: Record<string, string> = {}
    initialConfig.forEach((item) => {
      configMap[item.key] = typeof item.value === "string" ? item.value.replace(/"/g, "") : item.value
    })
    return configMap
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleConfigChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const saveConfiguration = async () => {
    setIsUpdating(true)
    const supabase = createClient()

    try {
      console.log("[v0] Starting configuration save...")

      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
      }))

      console.log("[v0] Updates to save:", updates)

      for (const update of updates) {
        const { error } = await supabase.from("site_config").update({ value: update.value }).eq("key", update.key)

        if (error) {
          console.error("[v0] Error updating config key:", update.key, error)
          throw error
        }
      }

      console.log("[v0] Configuration saved successfully")
      alert("Configuración guardada exitosamente")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving configuration:", error)
      alert(`Error al guardar la configuración: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const configSections = [
    {
      title: "Información General",
      fields: [
        { key: "site_name", label: "Nombre del Sitio", type: "text" },
        { key: "site_description", label: "Descripción del Sitio", type: "textarea" },
      ],
    },
    {
      title: "Información de Contacto",
      fields: [
        { key: "contact_email", label: "Email de Contacto", type: "email" },
        { key: "contact_phone", label: "Teléfono de Contacto", type: "tel" },
        { key: "whatsapp_number", label: "Número de WhatsApp", type: "tel" },
      ],
    },
    {
      title: "Redes Sociales",
      fields: [
        { key: "social_facebook", label: "URL de Facebook", type: "url" },
        { key: "social_instagram", label: "URL de Instagram", type: "url" },
      ],
    },
    {
      title: "Integraciones",
      fields: [{ key: "google_maps_api_key", label: "Clave API de Google Maps", type: "text" }],
    },
  ]

  return (
    <div className="space-y-6">
      {configSections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={config[field.key] || ""}
                    onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    value={config[field.key] || ""}
                    onChange={(e) => handleConfigChange(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={saveConfiguration} disabled={isUpdating} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  )
}
