-- Rename news table to news_articles to match application code
ALTER TABLE public.news RENAME TO news_articles;

-- Update RLS policies to use the new table name
DROP POLICY IF EXISTS "news_select_published" ON public.news_articles;
DROP POLICY IF EXISTS "news_select_admin" ON public.news_articles;
DROP POLICY IF EXISTS "news_insert_admin" ON public.news_articles;
DROP POLICY IF EXISTS "news_update_admin" ON public.news_articles;

-- Recreate policies with correct table name
CREATE POLICY "news_articles_select_published"
  ON public.news_articles FOR SELECT
  USING (is_published = true AND published_at <= now());

CREATE POLICY "news_articles_select_admin"
  ON public.news_articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "news_articles_insert_admin"
  ON public.news_articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "news_articles_update_admin"
  ON public.news_articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Update indexes to use the new table name
DROP INDEX IF EXISTS idx_news_published;
DROP INDEX IF EXISTS idx_news_slug;

CREATE INDEX IF NOT EXISTS idx_news_articles_published ON public.news_articles(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON public.news_articles(slug);
