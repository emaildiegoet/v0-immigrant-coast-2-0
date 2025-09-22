import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  let requestData: any
  let url: string

  try {
    requestData = await request.json()
    url = requestData.url

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log("[v0] Starting intelligent news extraction for:", url)

    const fetchResponse = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
        "Accept-Encoding": "gzip, deflate",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    })

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch content: ${fetchResponse.status} ${fetchResponse.statusText}`)
    }

    const html = await fetchResponse.text()
    console.log("[v0] Raw HTML content fetched, length:", html.length)

    const extractedData = extractContentFromHTML(html, url)
    console.log("[v0] Basic extraction - Title:", extractedData.title)
    console.log("[v0] Basic extraction - Content length:", extractedData.content.length)

    const fullContent = extractFullArticleContent(html, url)
    console.log("[v0] Full content extraction - Length:", fullContent.length)

    const cleanedContent = intelligentContentCleaning(fullContent || extractedData.content)
    console.log("[v0] Final cleaned content - Length:", cleanedContent.length)
    console.log("[v0] Final content preview:", cleanedContent.substring(0, 200) + "...")

    let rewrittenContent = cleanedContent
    if (cleanedContent && cleanedContent.length > 100) {
      try {
        console.log("[v0] Starting AI content rewriting with Groq...")
        const { text } = await generateText({
          model: groq("llama-3.1-8b-instant"),
          prompt: `Reescribe el siguiente artículo de noticias en español manteniendo toda la información factual, pero cambiando la redacción para que sea único y natural. Mantén el mismo tono periodístico y la estructura de párrafos. No agregues información nueva ni cambies fechas, nombres o datos específicos:

${cleanedContent}`,
          maxTokens: 2000,
        })

        rewrittenContent = text
        console.log("[v0] AI rewriting completed - Length:", rewrittenContent.length)
        console.log("[v0] Rewritten content preview:", rewrittenContent.substring(0, 200) + "...")
      } catch (aiError) {
        console.error("[v0] AI rewriting failed, using original content:", aiError)
        // Keep original content if AI rewriting fails
      }
    }

    const result = {
      title: extractedData.title || "Título no encontrado",
      content: rewrittenContent || "Contenido no encontrado. Por favor, edita manualmente.",
      image: extractedData.image,
      sourceUrl: url,
      author: "",
      publishedDate: "",
    }

    console.log("[v0] News extraction completed successfully")
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error in intelligent extraction:", error)

    try {
      if (!url && requestData?.url) {
        url = requestData.url
      }

      if (!url) {
        throw new Error("URL not available for fallback extraction")
      }

      console.log("[v0] Attempting fallback extraction...")

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      const extractedContent = extractContentFromHTML(html, url)

      console.log("[v0] Fallback extraction completed")
      return NextResponse.json(extractedContent)
    } catch (fallbackError) {
      console.error("[v0] All extraction methods failed:", fallbackError)
      return NextResponse.json(
        {
          error: "No se pudo extraer el contenido de la URL. Verifica que la URL sea válida y accesible.",
        },
        { status: 500 },
      )
    }
  }
}

function extractContentFromHTML(html: string, sourceUrl: string) {
  // Extract title with better priority
  const titleMatch =
    html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) ||
    html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/i) ||
    html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
    html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  const title = titleMatch ? cleanText(titleMatch[1]) : "Título no encontrado"
  console.log("[v0] Title extracted:", title)

  // Extract image with better priority
  const imageMatch =
    html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
    html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i) ||
    html.match(/<img[^>]*src="([^"]+)"[^>]*>/i)
  const image = imageMatch ? imageMatch[1] : undefined
  console.log("[v0] Image extracted:", image || "No image found")

  let content = ""

  // More comprehensive selectors for different CMS and news sites
  const mainContentSelectors = [
    // WordPress and common CMS patterns
    /<div[^>]*class="[^"]*(?:entry-content|post-content|article-content|main-content|content-area|post-body)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<article[^>]*class="[^"]*(?:post|article|entry|hentry)[^>]*"[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*(?:content|article-body|story-body|news-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // Specific news site patterns
    /<div[^>]*class="[^"]*(?:story|news-story|article-text|text-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<section[^>]*class="[^"]*(?:content|article|story)[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
    // Generic article and main tags
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    // ID-based selectors
    /<div[^>]*id="[^"]*(?:content|article|post|entry|story|main)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ]

  for (let i = 0; i < mainContentSelectors.length; i++) {
    const selector = mainContentSelectors[i]
    const match = html.match(selector)
    if (match) {
      console.log(`[v0] Content found with selector ${i + 1}`)
      const rawContent = match[1]
      console.log("[v0] Raw content length:", rawContent.length)

      // Filter out sections that are likely related articles or previews
      const filteredContent = filterOutRelatedContent(rawContent)
      console.log("[v0] Filtered content length:", filteredContent.length)

      content = cleanHTMLContent(filteredContent)
      console.log("[v0] Cleaned content length:", content.length)

      // Only use this content if it's substantial
      if (content.length > 200) {
        console.log("[v0] Using content from selector", i + 1)
        break
      }
    }
  }

  // If no substantial content found, try paragraph extraction with better filtering
  if (!content || content.length < 200) {
    console.log("[v0] Falling back to paragraph extraction")
    const paragraphs = html.match(/<p[^>]*>([^<]+(?:<[^>]+>[^<]*)*)<\/p>/gi)
    console.log("[v0] Found paragraphs:", paragraphs ? paragraphs.length : 0)

    if (paragraphs && paragraphs.length > 0) {
      // Filter paragraphs to exclude navigation, related articles, etc.
      const mainParagraphs = paragraphs
        .map((p) => cleanHTMLContent(p))
        .filter((p) => {
          const text = p.toLowerCase()
          const isValid =
            p.length > 80 &&
            !text.includes("leer más") &&
            !text.includes("ver más") &&
            !text.includes("relacionad") &&
            !text.includes("también te puede interesar") &&
            !text.includes("noticias relacionadas") &&
            !text.includes("más noticias") &&
            !text.includes("compartir") &&
            !text.includes("comentarios") &&
            !text.includes("suscríbete") &&
            !text.includes("newsletter") &&
            !text.match(/^\d{1,2}\/\d{1,2}\/\d{4}/) && // Skip date-only lines
            !text.match(/^por\s+\w+\s*$/) // Skip "por autor" lines
          return isValid
        })
        .slice(0, 15) // Take more paragraphs

      console.log("[v0] Valid paragraphs found:", mainParagraphs.length)
      content = mainParagraphs.join("\n\n")
    }
  }

  console.log("[v0] Final extracted content length:", content.length)
  return {
    title,
    content: content || "Contenido no encontrado. Por favor, edita manualmente.",
    image,
    sourceUrl,
  }
}

function extractFullArticleContent(html: string, sourceUrl: string): string {
  let content = ""
  console.log("[v0] Starting full article content extraction")

  const fullContentSelectors = [
    // WordPress and CMS patterns for full content
    /<div[^>]*class="[^"]*(?:entry-content|post-content|article-content|main-content|content-area|post-body|article-body)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<article[^>]*class="[^"]*(?:post|article|entry|hentry)[^>]*"[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*(?:content|story-body|news-content|article-text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // News-specific patterns
    /<div[^>]*class="[^"]*(?:story|news-story|article-wrapper|content-wrapper)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<section[^>]*class="[^"]*(?:content|article|story|main)[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
    // Generic article and main tags
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    // ID-based selectors
    /<div[^>]*id="[^"]*(?:content|article|post|entry|story|main)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ]

  for (let i = 0; i < fullContentSelectors.length; i++) {
    const selector = fullContentSelectors[i]
    const match = html.match(selector)
    if (match) {
      console.log(`[v0] Full content found with selector ${i + 1}`)
      const rawContent = match[1]
      console.log("[v0] Full raw content length:", rawContent.length)

      // Filter out sections but keep more content for full article
      const filteredContent = filterOutRelatedContent(rawContent)
      console.log("[v0] Full filtered content length:", filteredContent.length)

      content = cleanHTMLContent(filteredContent)
      console.log("[v0] Full cleaned content length:", content.length)

      // Accept content if it's substantial (lower threshold for full content)
      if (content.length > 300) {
        console.log("[v0] Using full content from selector", i + 1)
        break
      }
    }
  }

  // If no substantial content found, extract all paragraphs more aggressively
  if (!content || content.length < 300) {
    console.log("[v0] Full content fallback to paragraph extraction")
    const paragraphs = html.match(/<p[^>]*>([^<]+(?:<[^>]+>[^<]*)*)<\/p>/gi)
    console.log("[v0] Full content paragraphs found:", paragraphs ? paragraphs.length : 0)

    if (paragraphs && paragraphs.length > 0) {
      // Get more paragraphs for full content, but still filter out navigation
      const mainParagraphs = paragraphs
        .map((p) => cleanHTMLContent(p))
        .filter((p) => {
          const text = p.toLowerCase()
          return (
            p.length > 40 && // Lower threshold for individual paragraphs
            !text.includes("leer más") &&
            !text.includes("ver más") &&
            !text.includes("compartir") &&
            !text.includes("comentarios") &&
            !text.includes("suscríbete") &&
            !text.includes("newsletter") &&
            !text.match(/^por\s+\w+\s*$/) // Skip "por autor" lines
          )
        })
        .slice(0, 25) // Take even more paragraphs for full content

      console.log("[v0] Full content valid paragraphs:", mainParagraphs.length)
      content = mainParagraphs.join("\n\n")
    }
  }

  console.log("[v0] Final full content length:", content.length)
  return content
}

function filterOutRelatedContent(html: string): string {
  return (
    html
      // Remove sections with related articles
      .replace(
        /<div[^>]*class="[^"]*(?:related|similar|more-news|otras-noticias|noticias-relacionadas)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        "",
      )
      .replace(
        /<section[^>]*class="[^"]*(?:related|similar|more-news|otras-noticias)[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
        "",
      )
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      // Remove common preview/teaser sections
      .replace(/<div[^>]*class="[^"]*(?:preview|teaser|excerpt|summary)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
      // Remove navigation and social sharing
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<div[^>]*class="[^"]*(?:share|social|compartir)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
      // Remove comment sections
      .replace(/<div[^>]*class="[^"]*(?:comment|comentario)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
  )
}

function cleanHTMLContent(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
    .replace(
      /<div[^>]*class="[^"]*(?:ad|advertisement|sidebar|menu|navigation|related|similar)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      "",
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
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

function intelligentContentCleaning(text: string): string {
  if (!text) return ""

  return (
    text
      // Remove HTML tags if any remain
      .replace(/<[^>]+>/g, " ")
      // Clean up HTML entities
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&#8211;/g, "–")
      .replace(/&#8212;/g, "—")
      // Clean up multiple spaces and newlines
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      .replace(/^[\s\n]+|[\s\n]+$/gm, "")
      // Only filter out very obvious navigation elements
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim().toLowerCase()
        return (
          line.trim().length > 10 && // Much lower threshold
          !trimmed.match(/^[^\S\n]*$/) && // Skip empty lines
          !trimmed.includes("cookie") &&
          !trimmed.includes("suscríbete al newsletter") &&
          !trimmed.includes("compartir en facebook") &&
          !trimmed.includes("compartir en twitter")
        )
      })
      .join("\n\n")
      .trim()
  )
}
