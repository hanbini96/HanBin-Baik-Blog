-- Migration: Create migration service account
-- Purpose: Service account for GitHub Actions DB migrations
-- PostgreSQL compatible (no IF NOT EXISTS for roles)

-- Check if role exists first, then create if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'migration_user'
  ) THEN
    CREATE ROLE migration_user WITH LOGIN PASSWORD 'PLACEHOLDER_PASSWORD' NOSUPERUSER;
    RAISE NOTICE 'Created role: migration_user';
  ELSE
    RAISE NOTICE 'Role migration_user already exists';
  END IF;
END $$;

-- Grant minimal required permissions
GRANT USAGE ON SCHEMA public TO migration_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO migration_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO migration_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO migration_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO migration_user;

-- Create migration user record in users table
-- Use ON CONFLICT to handle existing user
INSERT INTO public.users (id, email, display_name, avatar_url, bio)
VALUES ('PLACEHOLDER_UUID', 'migration@hanbinbaik.com', 'Migration Bot', null, 'Automated migration service account')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

RAISE NOTICE 'Migration user setup complete';
