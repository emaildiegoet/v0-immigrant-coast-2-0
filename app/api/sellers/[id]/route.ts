import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const sellerId = params.id

    console.log("[v0] Fetching seller:", sellerId)

    const { data: seller, error } = await supabase.from("sellers").select("*").eq("id", sellerId).single()

    if (error) {
      console.error("[v0] Error fetching seller:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Seller not found" }, { status: 404 })
      }
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Seller fetched successfully:", seller.id)
    return NextResponse.json(seller)
  } catch (error) {
    console.error("[v0] Error in GET /api/sellers/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const sellerId = params.id

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin permissions
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const sellerData = await request.json()

    console.log("[v0] Updating seller:", sellerId, {
      first_name: sellerData.first_name,
      last_name: sellerData.last_name,
      whatsapp: sellerData.whatsapp,
    })

    // Validate required fields
    if (!sellerData.first_name || !sellerData.last_name || !sellerData.whatsapp) {
      return NextResponse.json({ error: "First name, last name, and WhatsApp are required" }, { status: 400 })
    }

    // Update seller
    const { data, error } = await supabase
      .from("sellers")
      .update({
        first_name: sellerData.first_name.trim(),
        last_name: sellerData.last_name.trim(),
        whatsapp: sellerData.whatsapp.trim(),
        description: sellerData.description?.trim() || null,
        email: sellerData.email?.trim() || null,
        is_active: sellerData.is_active !== false,
        profile_photo: sellerData.profile_photo?.trim() || null,
      })
      .eq("id", sellerId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error updating seller:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Seller not found" }, { status: 404 })
      }
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Seller updated successfully:", data.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating seller:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sellerId = params.id
    console.log("[v0] Admin API: Deleting seller:", sellerId)

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // First verify the seller exists
    const { data: existingSeller, error: fetchError } = await supabase
      .from("sellers")
      .select("id, first_name, last_name, created_by")
      .eq("id", sellerId)
      .single()

    if (fetchError) {
      console.error("[v0] Admin API: Seller not found:", fetchError)
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 })
    }

    console.log("[v0] Admin API: Seller found:", existingSeller)

    // Check if seller is assigned to any properties
    const { data: assignedProperties, error: propertiesError } = await supabase
      .from("properties")
      .select("id, title")
      .eq("seller_id", sellerId)
      .limit(1)

    if (propertiesError) {
      console.error("[v0] Admin API: Error checking assigned properties:", propertiesError)
      return NextResponse.json({ error: "Error verificando propiedades asignadas" }, { status: 500 })
    }

    if (assignedProperties && assignedProperties.length > 0) {
      console.log("[v0] Admin API: Seller has assigned properties, cannot delete")
      return NextResponse.json(
        {
          error:
            "No se puede eliminar el vendedor porque tiene propiedades asignadas. Primero reasigne las propiedades a otro vendedor.",
        },
        { status: 400 },
      )
    }

    // Delete the seller using admin client (bypasses RLS)
    const { data, error } = await supabase.from("sellers").delete().eq("id", sellerId).select()

    if (error) {
      console.error("[v0] Admin API: Database error:", error)
      return NextResponse.json({ error: `Error de base de datos: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Admin API: Seller deleted:", data)

    if (!data || data.length === 0) {
      console.warn("[v0] Admin API: No rows deleted")
      return NextResponse.json({ error: "No se pudo eliminar el vendedor" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Vendedor eliminado correctamente",
      deletedSeller: data[0],
    })
  } catch (error) {
    console.error("[v0] Admin API: Unexpected error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
