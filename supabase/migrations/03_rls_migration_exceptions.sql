-- Migration: RLS policy exceptions for migration user
-- Purpose: Allow migration user to bypass RLS restrictions
-- PostgreSQL compatible

-- Check if policy already exists before creating
DO $$
BEGIN
  -- Check and create policy for posts read access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'migration_user_read_all' 
    AND tablename = 'posts'
  ) THEN
    CREATE POLICY "migration_user_read_all"
      ON public.posts 
      FOR SELECT
      USING (auth.uid() = 'PLACEHOLDER_UUID' OR published = true);
    RAISE NOTICE 'Created policy: migration_user_read_all';
  ELSE
    RAISE NOTICE 'Policy migration_user_read_all already exists';
  END IF;

  -- Check and create policy for posts write access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'migration_user_write_all' 
    AND tablename = 'posts'
  ) THEN
    CREATE POLICY "migration_user_write_all"
      ON public.posts 
      FOR ALL
      USING (auth.uid() = 'PLACEHOLDER_UUID')
      WITH CHECK (auth.uid() = 'PLACEHOLDER_UUID');
    RAISE NOTICE 'Created policy: migration_user_write_all';
  ELSE
    RAISE NOTICE 'Policy migration_user_write_all already exists';
  END IF;

  -- Check and create policy for comments write access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'migration_user_comments_all' 
    AND tablename = 'comments'
  ) THEN
    CREATE POLICY "migration_user_comments_all"
      ON public.comments 
      FOR ALL
      USING (auth.uid() = 'PLACEHOLDER_UUID')
      WITH CHECK (auth.uid() = 'PLACEHOLDER_UUID');
    RAISE NOTICE 'Created policy: migration_user_comments_all';
  ELSE
    RAISE NOTICE 'Policy migration_user_comments_all already exists';
  END IF;

  RAISE NOTICE 'RLS policy exceptions setup complete';
END $$;
