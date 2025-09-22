import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: "URLs array is required" }, { status: 400 })
    }

    const results = await Promise.all(
      urls.map(async (url: string) => {
        try {
          // Using a simple fetch with better parsing
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "es-ES,es;q=0.8,en;q=0.6",
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }

          const html = await response.text()
          const parsed = parseArticleContent(html, url)

          return {
            url,
            ...parsed,
            error: null,
          }
        } catch (error) {
          return {
            url,
            error: error instanceof Error ? error.message : "Unknown error",
            title: null,
            text: null,
            description: null,
            image: null,
            author: null,
            publishedTime: null,
          }
        }
      }),
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error in fetch-content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function parseArticleContent(html: string, url: string) {
  // Extract title
  const title = extractTitle(html)

  // Extract meta description
  const description = extractDescription(html)

  // Extract main content
  const text = extractMainContent(html)

  // Extract image
  const image = extractImage(html, url)

  // Extract author
  const author = extractAuthor(html)

  // Extract published date
  const publishedTime = extractPublishedTime(html)

  return {
    title,
    text,
    description,
    image,
    author,
    publishedTime,
  }
}

function extractTitle(html: string): string {
  const patterns = [
    /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/i,
    /<title[^>]*>([^<]+)<\/title>/i,
    /<h1[^>]*class="[^"]*(?:title|headline)[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1].trim()) {
      return cleanText(match[1])
    }
  }

  return "Título no encontrado"
}

function extractDescription(html: string): string {
  const patterns = [
    /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="twitter:description"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1].trim()) {
      return cleanText(match[1])
    }
  }

  return ""
}

function extractMainContent(html: string): string {
  // Remove unwanted elements first
  const cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")

  // Try to find main content area
  const contentPatterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*(?:content|article|post|entry|story|text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]*id="[^"]*(?:content|article|post|entry|story|text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<section[^>]*class="[^"]*(?:content|article|post|entry|story|text)[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
  ]

  for (const pattern of contentPatterns) {
    const match = cleanHtml.match(pattern)
    if (match) {
      const content = extractTextFromHTML(match[1])
      if (content.length > 200) {
        return content
      }
    }
  }

  // Fallback: extract from paragraphs
  const paragraphs = cleanHtml.match(/<p[^>]*>([^<]+(?:<[^>]+>[^<]*)*)<\/p>/gi)
  if (paragraphs && paragraphs.length > 0) {
    const content = paragraphs
      .map((p) => extractTextFromHTML(p))
      .filter((p) => p.length > 30)
      .join("\n\n")

    if (content.length > 100) {
      return content
    }
  }

  return ""
}

function extractTextFromHTML(html: string): string {
  return html
    .replace(/<br[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function extractImage(html: string, baseUrl: string): string | null {
  const patterns = [
    /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i,
    /<img[^>]*class="[^"]*(?:featured|hero|main)[^"]*"[^>]*src="([^"]+)"/i,
    /<img[^>]*src="([^"]+)"[^>]*>/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      let imageUrl = match[1]

      // Convert relative URLs to absolute
      if (imageUrl.startsWith("//")) {
        imageUrl = "https:" + imageUrl
      } else if (imageUrl.startsWith("/")) {
        const urlObj = new URL(baseUrl)
        imageUrl = urlObj.origin + imageUrl
      }

      return imageUrl
    }
  }

  return null
}

function extractAuthor(html: string): string {
  const patterns = [
    /<meta[^>]*name="author"[^>]*content="([^"]+)"/i,
    /<meta[^>]*property="article:author"[^>]*content="([^"]+)"/i,
    /<span[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/div>/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1].trim()) {
      return cleanText(match[1])
    }
  }

  return ""
}

function extractPublishedTime(html: string): string {
  const patterns = [
    /<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i,
    /<time[^>]*datetime="([^"]+)"/i,
    /<meta[^>]*name="date"[^>]*content="([^"]+)"/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return ""
}

function cleanText(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
