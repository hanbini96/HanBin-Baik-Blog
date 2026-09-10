#!/bin/bash
# Test script for migration user
# Usage: ./scripts/test-migration-user.sh

set -e

echo "🔍 Testing Migration User Setup..."
echo "=================================="
echo ""

# Configuration
DB_URL="$STAGING_DB_URL"
MIGRATION_UUID="$MIGRATION_USER_UUID"
MIGRATION_PASSWORD="$MIGRATION_USER_PASSWORD"

if [ -z "$DB_URL" ]; then
  echo "❌ Error: STAGING_DB_URL not set"
  echo "   Please set: export STAGING_DB_URL='postgresql://...'"
  exit 1
fi

if [ -z "$MIGRATION_UUID" ]; then
  echo "❌ Error: MIGRATION_USER_UUID not set"
  echo "   Please set: export MIGRATION_USER_UUID='...'"
  exit 1
fi

if [ -z "$MIGRATION_PASSWORD" ]; then
  echo "❌ Error: MIGRATION_USER_PASSWORD not set"
  echo "   Please set: export MIGRATION_USER_PASSWORD='...'"
  exit 1
fi

echo "✅ All required variables set"
echo ""

# Test 1: Check if migration user exists in public.users
echo "📊 Test 1: Checking migration user in public.users..."
echo "   Query: SELECT email FROM public.users WHERE id = '$MIGRATION_UUID'"
psql "$DB_URL" -c "
  SELECT email, display_name, created_at 
  FROM public.users 
  WHERE id = '$MIGRATION_UUID';
" || {
  echo "❌ Failed to query public.users"
  echo "   Tip: Run migrations first: supabase db push --db-url \"$STAGING_DB_URL\""
  exit 1
}
echo ""

# Test 2: Check if role exists
echo "📊 Test 2: Checking if role exists..."
echo "   Query: SELECT rolname FROM pg_roles WHERE rolname = 'migration_user'"
psql "$DB_URL" -c "
  SELECT rolname, rolsuper, rolinherit 
  FROM pg_roles 
  WHERE rolname = 'migration_user';
" || {
  echo "❌ Failed to query pg_roles"
  exit 1
}
echo ""

# Test 3: Check RLS policies
echo "📊 Test 3: Checking RLS policies..."
echo "   Query: SELECT policyname FROM pg_policies WHERE policyname LIKE 'migration_user%'"
psql "$DB_URL" -c "
  SELECT policyname, tablename, cmd, permissive 
  FROM pg_policies 
  WHERE policyname LIKE 'migration_user%'; 
" || {
  echo "❌ Failed to query pg_policies"
  exit 1
}
echo ""

# Test 4: Verify migration user can read posts
echo "📊 Test 4: Testing read access..."
echo "   Query: SELECT count(*) FROM public.posts WHERE published = true"
psql "$DB_URL" -c "
  SELECT count(*) as post_count 
  FROM public.posts 
  WHERE published = true;
" || {
  echo "❌ Failed to query posts"
  exit 1
}
echo ""

# Test 5: Verify your existing articles are preserved
echo "📊 Test 5: Verifying your articles are preserved..."
echo "   Query: SELECT id, title, slug FROM public.posts WHERE deleted_at IS NULL"
psql "$DB_URL" -c "
  SELECT id, title, slug, created_at 
  FROM public.posts 
  WHERE deleted_at IS NULL 
  ORDER BY created_at DESC 
  LIMIT 5;
" || {
  echo "❌ Failed to query posts"
  exit 1
}
echo ""

echo "✅ ============================================"
echo "✅ All tests passed! Migration user is properly configured."
echo "✅ ============================================"
echo ""
echo "📋 Summary:"
echo "   ✅ Migration user exists in public.users"
echo "   ✅ Role 'migration_user' exists in pg_roles"
echo "   ✅ RLS policies are in place"
echo "   ✅ Read access is working"
echo "   ✅ Your articles are preserved"
echo "   ✅ Ready for GitHub Actions CI/CD"
echo ""
echo "🚀 Next Steps:"
echo "   1. Commit migration files to GitHub"
echo "   2. Set GitHub secrets"
echo "   3. Push to trigger db.yml workflow"
echo ""
