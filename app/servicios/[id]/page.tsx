import { createClient } from "@/lib/supabase/server"
import { ServiceDetails } from "@/components/service-details"
import { ServiceContact } from "@/components/service-contact"
import { ServiceReviews } from "@/components/service-reviews"
import { ServiceGallery } from "@/components/service-gallery"
import { GoogleMap } from "@/components/google-map"
import { notFound } from "next/navigation"

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !service) {
    notFound()
  }

  // Get reviews for this service
  const { data: reviews } = await supabase
    .from("service_reviews")
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq("service_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ServiceGallery images={service.images || []} name={service.name} />
            <ServiceDetails service={service} />
            <ServiceReviews serviceId={service.id} reviews={reviews || []} />
          </div>

          <div className="space-y-6">
            <ServiceContact service={service} />
            {service.address && (
              <GoogleMap
                address={service.address}
                latitude={service.latitude}
                longitude={service.longitude}
                title={service.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
