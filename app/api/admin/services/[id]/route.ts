import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const serviceId = params.id
    console.log("[v0] Admin API: Deleting service:", serviceId)

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // First verify the service exists
    const { data: existingService, error: fetchError } = await supabase
      .from("services")
      .select("id, name, created_by")
      .eq("id", serviceId)
      .single()

    if (fetchError) {
      console.error("[v0] Admin API: Service not found:", fetchError)
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }

    console.log("[v0] Admin API: Service found:", existingService)

    // Delete the service using admin client (bypasses RLS)
    const { data, error } = await supabase.from("services").delete().eq("id", serviceId).select()

    if (error) {
      console.error("[v0] Admin API: Database error:", error)
      return NextResponse.json({ error: `Error de base de datos: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Admin API: Service deleted:", data)

    if (!data || data.length === 0) {
      console.warn("[v0] Admin API: No rows deleted")
      return NextResponse.json({ error: "No se pudo eliminar el servicio" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Servicio eliminado correctamente",
      deletedService: data[0],
    })
  } catch (error) {
    console.error("[v0] Admin API: Unexpected error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
