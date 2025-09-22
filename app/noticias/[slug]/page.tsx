import { createClient } from "@/lib/supabase/server"
import { NewsContent } from "@/components/news-content"
import { NewsAuthor } from "@/components/news-author"
import { RelatedNews } from "@/components/related-news"
import { NewsShare } from "@/components/news-share"
import { notFound } from "next/navigation"

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from("news_articles")
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url,
        email
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !article) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("news_articles")
    .update({ views_count: (article.views_count || 0) + 1 })
    .eq("id", article.id)

  // Get related articles
  const { data: relatedArticles } = await supabase
    .from("news_articles")
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `)
    .eq("is_published", true)
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <article className="mb-12">
          <NewsContent article={article} />
          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <NewsAuthor author={article.profiles} publishedAt={article.published_at} />
            </div>
            <div className="lg:w-64">
              <NewsShare article={article} />
            </div>
          </div>
        </article>

        {relatedArticles && relatedArticles.length > 0 && (
          <RelatedNews articles={relatedArticles} currentCategory={article.category} />
        )}
      </div>
    </div>
  )
}
