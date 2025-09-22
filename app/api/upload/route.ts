import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      const filename = `${Date.now()}-${file.name}`
      const blob = await put(filename, file, {
        access: "public",
      })
      return blob.url
    })

    const urls = await Promise.all(uploadPromises)

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
