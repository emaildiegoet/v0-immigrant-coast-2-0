import { createClient } from "@/lib/supabase/server"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyDetails } from "@/components/property-details"
import { PropertyContact } from "@/components/property-contact"
import { PropertyLocationMap } from "@/components/property-location-map"
import { notFound } from "next/navigation"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      *,
      seller:sellers(
        id,
        first_name,
        last_name,
        whatsapp,
        email,
        description,
        profile_photo
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !property) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("properties")
    .update({ views_count: (property.views_count || 0) + 1 })
    .eq("id", id)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyGallery images={property.images || []} title={property.title} />
            <PropertyDetails property={property} />
          </div>

          <div className="space-y-6">
            <PropertyContact property={property} />
            <PropertyLocationMap
              address={property.address}
              latitude={property.latitude}
              longitude={property.longitude}
              title={property.title}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
