import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("include_inactive") === "true"

    console.log("[v0] Fetching sellers, include_inactive:", includeInactive)

    let query = supabase.from("sellers").select("*").order("created_at", { ascending: false })

    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data: sellers, error } = await query

    if (error) {
      console.error("[v0] Error fetching sellers:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Sellers fetched successfully:", sellers?.length || 0)
    return NextResponse.json(sellers || [])
  } catch (error) {
    console.error("[v0] Error in GET /api/sellers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

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

    console.log("[v0] Creating seller:", {
      first_name: sellerData.first_name,
      last_name: sellerData.last_name,
      whatsapp: sellerData.whatsapp,
    })

    // Validate required fields
    if (!sellerData.first_name || !sellerData.last_name || !sellerData.whatsapp) {
      return NextResponse.json({ error: "First name, last name, and WhatsApp are required" }, { status: 400 })
    }

    // Insert seller
    const { data, error } = await supabase
      .from("sellers")
      .insert({
        first_name: sellerData.first_name.trim(),
        last_name: sellerData.last_name.trim(),
        whatsapp: sellerData.whatsapp.trim(),
        description: sellerData.description?.trim() || null,
        email: sellerData.email?.trim() || null,
        is_active: sellerData.is_active !== false, // Default to true
        profile_photo: sellerData.profile_photo?.trim() || null,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error creating seller:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Seller created successfully:", data.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating seller:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
