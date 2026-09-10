# 📚 Migration User Guide

## Overview

This guide explains how to use the **migration user** (`migration@hanbinbaik.com`) for automated database operations via GitHub Actions.

---

## 🎯 Purpose

The migration user serves as a **service account** for:
- GitHub Actions CI/CD workflows
- Automated database migrations
- Schema updates
- Data migrations

---

## 🔐 Authentication Details

| Field | Value | How to Get |
|-------|-------|------------|
| **Email** | `migration@hanbinbaik.com` | Hardcoded in migrations |
| **UUID** | `{{MIGRATION_USER_UUID}}` | Generated via `uuidgen` |
| **Password** | `{{MIGRATION_USER_PASSWORD}}` | Set by you |
| **Role** | `migration_user` | Created in migration 01 |

---

## 🚀 How to Use

### 1. Generate UUID and Set Password

```bash
# Generate UUID
uuidgen
# Example output: 123e4567-e89b-12d3-a456-426614174000

# Set a strong password (store securely!)
export MIGRATION_PASSWORD="Your-Strong-Password-Here-2024!"
```

### 2. Update Migration Files

Replace placeholders in all three migration files:

```bash
# Replace UUID
sed -i "s/{{MIGRATION_USER_UUID}}/123e4567-e89b-12d3-a456-426614174000/g" supabase/migrations/*.sql

# Replace password
sed -i "s/{{MIGRATION_USER_PASSWORD}}/$MIGRATION_PASSWORD/g" supabase/migrations/*.sql
```

### 3. Test Locally

```bash
# Install Supabase CLI
npm install -g supabase@latest

# Link to your project (replace YOUR_PROJECT_REF)
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations locally
export STAGING_DB_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?search_path=public&sslmode=require"
supabase db push --db-url "$STAGING_DB_URL"

# Verify migration worked
supabase db diff
```

### 4. Verify Migration User

```sql
-- Check if migration user exists
SELECT * FROM public.users WHERE email = 'migration@hanbinbaik.com';

-- Check if role exists
SELECT * FROM pg_roles WHERE rolname = 'migration_user';

-- Check permissions
d SELECT grantee, privilege_type, table_name 
FROM information_schema.role_table_grants 
WHERE grantee = 'migration_user';
```

---

## 🔧 GitHub Actions Integration

### Required GitHub Secrets

Go to: `https://github.com/hanbini96/HanBin-Baik-Blog/settings/secrets/actions`

Add these secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `SUPABASE_PROJECT_REF` | Your Supabase project reference | `abcdefghijklmnopqrst` |
| `SUPABASE_ACCESS_TOKEN` | Supabase access token | `sbx.your-token-here` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGciOiJIUzI1NiIs...` |
| `STAGING_DB_URL` | Staging DB connection string | `postgresql://...` |
| `PROD_DB_URL` | Production DB connection string | `postgresql://...` |
| `MIGRATION_USER_PASSWORD` | Migration user password | `Your-Strong-Password` |
| `MIGRATION_USER_UUID` | Migration user UUID | `123e4567-e89b-12d3...` |

### How GitHub Actions Uses Migration User

The `db.yml` workflow uses the migration user for:

1. **Applying migrations** via `supabase db push`
2. **Database operations** with proper permissions
3. **Bypassing RLS restrictions** (via policies in migration 03)

---

## 📊 Database Operations with Migration User

### Connect as Migration User

```bash
# Using psql
psql "postgresql://migration_user:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?search_path=public&sslmode=require"

# Using Supabase SQL Editor
-- Connect with email: migration@hanbinbaik.com
-- Password: YOUR_PASSWORD
```

### Common Operations

```sql
-- Query all published posts
SELECT id, title, slug, published_at 
FROM public.posts 
WHERE published = true 
ORDER BY published_at DESC;

-- Update a post
UPDATE public.posts 
SET title = 'New Title', updated_at = NOW() 
WHERE id = 'post-uuid-here';

-- Check comments on a post
SELECT * FROM public.comments 
WHERE post_id = 'post-uuid-here' 
ORDER BY created_at DESC;
```

---

## 🔐 Security Best Practices

### Password Management

1. **Use a strong password**: At least 16 characters with mixed case, numbers, and symbols
2. **Store securely**: Use GitHub secrets (never in code)
3. **Rotate periodically**: Change password every 6-12 months
4. **Never commit**: The password is in GitHub secrets only

### Permission Management

The migration user has **minimal required permissions**:
- ✅ Read/Write on `posts`, `comments`, `users` tables
- ✅ Usage on `public` schema
- ✅ Usage on sequences
- ❌ No superuser privileges
- ❌ No admin access

### Audit Trail

```sql
-- Check who used the migration user
SELECT * FROM auth.audit_log_entries 
WHERE email = 'migration@hanbinbaik.com' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🧪 Testing the Migration User

### Test Script: `scripts/test-migration-user.sh`

```bash
#!/bin/bash
# Test script for migration user
# Usage: ./scripts/test-migration-user.sh

set -e

echo "🔍 Testing Migration User Setup..."

# Configuration
DB_URL="$STAGING_DB_URL"
MIGRATION_UUID="$MIGRATION_USER_UUID"
MIGRATION_PASSWORD="$MIGRATION_USER_PASSWORD"

if [ -z "$DB_URL" ]; then
  echo "❌ Error: STAGING_DB_URL not set"
  exit 1
fi

if [ -z "$MIGRATION_UUID" ]; then
  echo "❌ Error: MIGRATION_USER_UUID not set"
  exit 1
fi

if [ -z "$MIGRATION_PASSWORD" ]; then
  echo "❌ Error: MIGRATION_USER_PASSWORD not set"
  exit 1
fi

echo "✅ All required variables set"

# Test 1: Check if migration user exists in public.users
echo "📊 Test 1: Checking migration user in public.users..."
psql "$DB_URL" -c "
  SELECT email, display_name, created_at 
  FROM public.users 
  WHERE id = '$MIGRATION_UUID';
" || {
  echo "❌ Failed to query public.users"
  exit 1
}

# Test 2: Check if role exists
echo "📊 Test 2: Checking if role exists..."
psql "$DB_URL" -c "
  SELECT rolname, rolsuper, rolinherit 
  FROM pg_roles 
  WHERE rolname = 'migration_user';
" || {
  echo "❌ Failed to query pg_roles"
  exit 1
}

# Test 3: Check RLS policies
echo "📊 Test 3: Checking RLS policies..."
psql "$DB_URL" -c "
  SELECT policyname, tablename, cmd, permissive 
  FROM pg_policies 
  WHERE policyname LIKE 'migration_user%'; 
" || {
  echo "❌ Failed to query pg_policies"
  exit 1
}

# Test 4: Verify migration user can read posts
echo "📊 Test 4: Testing read access..."
psql "$DB_URL" -c "
  SELECT count(*) as post_count 
  FROM public.posts 
  WHERE published = true;
" || {
  echo "❌ Failed to query posts"
  exit 1
}

echo ""
echo "✅ All tests passed! Migration user is properly configured."
echo ""
echo "📋 Summary:"
echo "   - Migration user exists in public.users"
echo "   - Role 'migration_user' exists in pg_roles"
echo "   - RLS policies are in place"
echo "   - Read access is working"
echo "   - Ready for GitHub Actions CI/CD"
```

### Make Test Script Executable

```bash
chmod +x scripts/test-migration-user.sh
```

### Run Test Script

```bash
# Set environment variables
# (Replace with your actual values)
export STAGING_DB_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?search_path=public&sslmode=require"
export MIGRATION_USER_UUID="123e4567-e89b-12d3-a456-426614174000"
export MIGRATION_USER_PASSWORD="Your-Strong-Password"

# Run test
./scripts/test-migration-user.sh
```

---

## 🚨 Troubleshooting

### Issue 1: "Permission denied for schema public"

**Error:** `ERROR: permission denied for schema public`

**Solution:**
```sql
GRANT USAGE ON SCHEMA public TO migration_user;
```

### Issue 2: "Role does not exist"

**Error:** `ERROR: role "migration_user" does not exist`

**Solution:** Run migration 01 again:
```bash
supabase db push --db-url "$STAGING_DB_URL"
```

### Issue 3: RLS policies blocking access

**Error:** `ERROR: new row violates row-level security policy`

**Solution:** Check migration 03 was applied:
```sql
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

### Issue 4: GitHub Actions workflow fails

**Error:** Workflow fails with connection errors

**Solution:**
1. Check GitHub Actions logs
2. Verify secrets are correct
3. Ensure network restrictions allow GitHub IPs
4. Test connection manually:
```bash
curl -I -fsSL --max-time 10 https://github.com
```

---

## 📈 Monitoring

### Check Migration User Activity

```sql
-- Recent activity
SELECT 
  a.email,
  a.created_at,
  a.action,
  a.ip_address
FROM auth.audit_log_entries a
WHERE a.email = 'migration@hanbinbaik.com'
ORDER BY a.created_at DESC
LIMIT 20;

-- Database connections
SELECT * FROM pg_stat_activity 
WHERE usename = 'migration_user';
```

### GitHub Actions Monitoring

Check workflow runs at:
`.github/workflows/db.yml`

---

## 🔄 Maintenance

### Rotate Password

```bash
# 1. Update password in migration files
sed -i "s/{{MIGRATION_USER_PASSWORD}}/NEW_PASSWORD/g" supabase/migrations/*.sql

# 2. Update GitHub secret
# Go to: https://github.com/hanbini96/HanBin-Baik-Blog/settings/secrets/actions

# 3. Apply migration
supabase db push --db-url "$STAGING_DB_URL"

# 4. Test
./scripts/test-migration-user.sh
```

### Clean Up Old Data

```sql
-- Soft delete old articles (if needed)
UPDATE public.posts 
SET deleted_at = NOW() 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Vacuum to reclaim space
VACUUM (VERBOSE, ANALYZE) public.posts;
```

---

## 📞 Support

### Questions?
- Check this guide first
- Review migration files in `supabase/migrations/`
- Check GitHub Actions logs
- Review Supabase dashboard logs

### Need Help?
- Open an issue: https://github.com/hanbini96/HanBin-Baik-Blog/issues
- Check Supabase docs: https://supabase.com/docs
- Ask in Supabase community: https://supabase.com/community

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-31 | Initial guide for migration user setup |
| 1.1 | 2025-02-01 | Added test script and troubleshooting |

---

**Last Updated:** August 31, 2026  
**Guide Version:** 1.0  
**Migration Files:** 01_create_migration_user.sql, 02_cleanup_existing_articles.sql, 03_rls_migration_exceptions.sql
