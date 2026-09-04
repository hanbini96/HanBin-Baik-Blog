-- Migration: Preserve and prepare existing articles
-- Purpose: Ensure existing articles are properly migrated to new schema
-- PostgreSQL compatible

DO $$
DECLARE
  article_count INTEGER;
BEGIN
  -- Count existing articles
  SELECT COUNT(*) INTO article_count FROM public.posts WHERE deleted_at IS NULL;
  
  RAISE NOTICE 'Found % published articles to preserve', article_count;
  
  -- Ensure all existing articles have proper metadata
  UPDATE public.posts
  SET 
    published = published,  -- Preserve published status
    published_at = COALESCE(published_at, created_at),  -- Set published_at if null
    updated_at = NOW()
  WHERE deleted_at IS NULL;
  
  RAISE NOTICE 'Prepared % articles for migration', article_count;
  
  -- Verify articles are ready
  RAISE NOTICE 'Sample articles:';
  PERFORM * FROM public.posts WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 3;
END $$;

-- Optional: Verify preservation
-- SELECT id, title, slug, published, created_at FROM public.posts WHERE deleted_at IS NULL ORDER BY created_at DESC;
