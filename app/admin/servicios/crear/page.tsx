"use client"

import { ServiceForm } from "@/components/service-form"
import { useRouter } from "next/navigation"

export default function CreateServicePage() {
  const router = useRouter()

  const handleClose = () => {
    router.push("/admin/servicios")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Servicio</h1>
        <p className="text-muted-foreground">Agrega un nuevo servicio a la plataforma</p>
      </div>

      <ServiceForm onClose={handleClose} />
    </div>
  )
}
