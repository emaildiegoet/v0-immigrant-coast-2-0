import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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

    const newsData = await request.json()

    console.log("[v0] Received news data:", {
      title: newsData.title?.substring(0, 50) + "...",
      category: newsData.category,
      categoryType: typeof newsData.category,
      hasCategory: !!newsData.category,
      allFields: Object.keys(newsData),
    })

    // Validate required fields
    if (!newsData.category) {
      console.log("[v0] Category validation failed: category is missing or empty")
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    const validCategories = ["local", "inmobiliario", "servicios", "eventos", "turismo", "general"]
    if (!validCategories.includes(newsData.category)) {
      console.log("[v0] Category validation failed: invalid category value", {
        received: newsData.category,
        valid: validCategories,
      })
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Generate slug from title
    const slug = newsData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    console.log("[v0] About to insert news article with category:", newsData.category)

    // Insert news article
    const { data, error } = await supabase
      .from("news_articles")
      .insert({
        title: newsData.title,
        slug: `${slug}-${Date.now()}`,
        content: newsData.content,
        featured_image: newsData.featured_image,
        category: newsData.category,
        tags: newsData.tags || [],
        is_published: newsData.is_published || false,
        is_featured: false,
        author_id: user.id,
        published_at: newsData.is_published ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] News article created successfully:", data.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating news:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
