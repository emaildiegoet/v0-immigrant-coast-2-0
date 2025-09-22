import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ServiceForm } from "@/components/service-form"

interface EditServicePageProps {
  params: {
    id: string
  }
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const supabase = await createClient()

  // Get the service data
  const { data: service, error } = await supabase.from("services").select("*").eq("id", params.id).single()

  if (error || !service) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar Servicio</h1>
          <p className="text-muted-foreground mt-2">Modifica la información del servicio</p>
        </div>

        <ServiceForm initialData={service} isEditing={true} />
      </div>
    </div>
  )
}
