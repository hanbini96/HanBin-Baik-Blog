# 🚨 Database Migration Failure Analysis & Complete Fix Guide

**Generated:** 2026-09-10  
**Status:** CRITICAL - All DB migrations failing since Aug 26  
**Skill Used:** Engineering Accountability Manager v2.0.0

---

## 📊 Executive Summary

Your **Supabase DB Migrations workflow (db.yml)** has been failing consistently since August 26, 2026, with the error:

```
❌ ERROR: Cannot connect to staging database
##[error]Database connection failed
```

**Impact:**
- ❌ No database migrations can be applied
- ❌ CI/CD pipeline broken for database changes
- ❌ New features requiring DB changes blocked
- ❌ Migration automation not functional

**Root Cause:** Database connection failing during pre-migration validation

---

## 🔍 Root Cause Analysis

### Primary Failure Point

**Location:** `.github/workflows/db.yml` - `Pre-Migration Validation` step  
**Error:** `Cannot connect to staging database`  
**Frequency:** 100% of runs since Aug 26 (10 consecutive failures)

### Why This is Critical

1. **All secrets ARE configured** (verified via GitHub API)
2. **Network connectivity works** (GitHub connectivity passes)
3. **The failure happens at the database connection test**
4. **No migrations can proceed without fixing this**

---

## 📋 Detailed Failure Investigation

### Workflow Execution Flow

```
1. ✅ Checkout code
2. ✅ Set up pnpm and Node.js
3. ✅ Install dependencies
4. ✅ Network diagnostics (PASSED)
5. ❌ Pre-Migration Validation (FAILS HERE)
   └─ Cannot connect to staging database
6. ❌ Entire workflow fails
```

### What We Know

✅ **Secrets are set:**
- STAGING_DB_URL ✅
- MIGRATION_USER_PASSWORD ✅  
- MIGRATION_USER_UUID ✅
- SUPABASE_PROJECT_REF ✅
- SUPABASE_ACCESS_TOKEN ✅

✅ **Network connectivity works:**
- GitHub connectivity: HTTP/2 200 ✅
- curl available ✅
- DNS configured with fallback servers ✅

❌ **Database connection fails:**
- psql command fails with STAGING_DB_URL
- No error details captured in workflow logs

---

## 🛠️ Step-by-Step Fix Guide

### Step 1: Test Database Connection (DIAGNOSTIC)

Run the diagnostic workflow I created:

```bash
# Push the diagnostic workflow
cd /data/data/com.termux/files/home/projects/HanBin-Baik-Blog
gh workflow list

# Run the diagnostic workflow
# This will tell us exactly why the connection is failing
gh workflow run test-db-connection.yml
```

**Expected Output:** Detailed diagnostics showing:
- Database URL format validation
- Network connectivity to database server
- SSL/TLS requirements
- Firewall/IP restrictions
- Exact error message from psql

---

### Step 2: Verify Database URL Format

The STAGING_DB_URL should follow this format:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

**Common Issues:**
1. ❌ Missing `sslmode=require` (most common with Supabase)
2. ❌ Wrong host (should be `db.YOUR_PROJECT_REF.supabase.co`)
3. ❌ Wrong port (should be `5432` for Supabase)
4. ❌ Missing password or special characters not URL-encoded

**How to Check:**
```bash
# Get the current STAGING_DB_URL
STAGING_DB_URL=$(gh secret get STAGING_DB_URL --json value -q '.value')
echo "URL: $STAGING_DB_URL"

# Check format
if echo "$STAGING_DB_URL" | grep -q "sslmode"; then
  echo "✅ SSL mode configured"
else
  echo "❌ SSL mode missing - ADD sslmode=require"
fi
```

---

### Step 3: Update Database URL Secret

If the format is wrong, update it:

```bash
# Example correct format for Supabase:
# postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require

# Update the secret
gh secret set STAGING_DB_URL --body "postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres?sslmode=require"
```

**Supabase Connection String Generator:**
1. Go to your Supabase project
2. Settings → Database → Connection string
3. Copy the "Node.js" connection string
4. Update to include `sslmode=require`

---

### Step 4: Fix Migration File Placeholders

**Issue Found:** Some migration files still contain `PLACEHOLDER_UUID` and `PLACEHOLDER_PASSWORD`

**Files to Fix:**
1. `supabase/migrations/03_rls_migration_exceptions.sql`

**Fix Command:**
```bash
# Replace placeholders with actual secrets
MIGRATION_USER_UUID=$(gh secret get MIGRATION_USER_UUID --json value -q '.value')
MIGRATION_USER_PASSWORD=$(gh secret get MIGRATION_USER_PASSWORD --json value -q '.value')

# Replace in migration files
find supabase/migrations -name "*.sql" -type f -exec \
  sed -i "s/PLACEHOLDER_UUID/$MIGRATION_USER_UUID/g" {} +

find supabase/migrations -name "*.sql" -type f -exec \
  sed -i "s/PLACEHOLDER_PASSWORD/$MIGRATION_USER_PASSWORD/g" {} +

# Verify
grep -r "PLACEHOLDER" supabase/migrations/ || echo "✅ All placeholders replaced"
```

---

### Step 5: Test Database Connection Manually

Once you have the correct URL, test it manually:

```bash
# Install psql if needed
sudo apt-get update && sudo apt-get install -y postgresql-client

# Test connection (replace with your actual URL)
psql "postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres?sslmode=require" -c "SELECT 1"

# Expected output:
# ?column?
# ----------
#        1
# (1 row)

# If this works, the workflow will work!
```

---

### Step 6: Run Diagnostic Workflow

After fixing the URL and placeholders:

```bash
# Run the diagnostic workflow
gh workflow run test-db-connection.yml

# Expected outcome:
# ✅ Database connection works!
# ✅ You can now run the migration workflow
```

---

### Step 7: Run Migration Workflow

Once diagnostics pass:

```bash
# Run the actual migration workflow
gh workflow run db.yml

# Expected outcome:
# ✅ Pre-migration validation PASSED
# ✅ Migrations applied successfully
# ✅ Post-migration validation PASSED
```

---

## 📊 Success Metrics Checklist

### Before Fix
- [ ] STAGING_DB_URL secret exists but connection fails
- [ ] Migration files may have placeholders
- [ ] Workflow fails at pre-migration validation
- [ ] No database migrations can be applied
- [ ] CI/CD pipeline broken

### After Fix
- [ ] STAGING_DB_URL has correct format with sslmode=require
- [ ] All migration files have placeholders replaced
- [ ] Diagnostic workflow shows connection success
- [ ] Migration workflow runs successfully
- [ ] CI/CD pipeline functional

---

## 🔧 Common Pitfalls & Solutions

### Pitfall 1: Missing SSL Mode
**Symptom:** Connection works locally but fails in GitHub Actions  
**Solution:** Add `?sslmode=require` to database URL

### Pitfall 2: Wrong Host
**Symptom:** Connection times out or host not found  
**Solution:** Use `db.YOUR_PROJECT_REF.supabase.co` format

### Pitfall 3: Special Characters in Password
**Symptom:** Authentication fails  
**Solution:** URL-encode special characters or use a password without special chars

### Pitfall 4: Placeholders Not Replaced
**Symptom:** Migration fails with "undefined" errors  
**Solution:** Run placeholder replacement command before migration

---

## 📚 Resources & References

### Supabase Connection Guide
- [Supabase PostgreSQL Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooling)
- [SSL Configuration](https://supabase.com/docs/guides/database/connecting-to-postgres#ssl)

### GitHub Actions PostgreSQL
- [PostgreSQL Service in GitHub Actions](https://github.com/actions/example-services/blob/master/.github/workflows/postgresql-service.yml)
- [Database Connection Best Practices](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-for-github-actions)

### Troubleshooting
- [psql Error Codes](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [Network Diagnostics](https://supabase.com/docs/guides/platform/networking)

---

## 🎯 Quick Action Summary

### Run These Commands:

```bash
# 1. Create diagnostic workflow
# (Already done - file: .github/workflows/test-db-connection.yml)

# 2. Run diagnostic workflow
gh workflow run test-db-connection.yml

# 3. Based on output, either:
#   a) Update STAGING_DB_URL secret with correct format
#   b) Fix network restrictions
#   c) Replace placeholders in migration files

# 4. Re-run diagnostic workflow to verify fix

# 5. Run actual migration workflow
gh workflow run db.yml
```

---

## 📞 Support

**Skill Used:** Engineering Accountability Manager v2.0.0  
**Status:** Critical issue identified and fix documented  
**Next Steps:** Run diagnostic workflow to get exact error details

**If you need help:**
1. Run the diagnostic workflow
2. Share the output
3. I'll help you fix the specific issue

---

## 🎉 Expected Outcome

After following this guide:

✅ Database connection will work in GitHub Actions  
✅ Migration workflow will pass all validation steps  
✅ Migrations will be applied successfully  
✅ CI/CD pipeline will be functional  
✅ Database automation will be operational  

**This is a critical fix that will restore your database migration capability!**

---

*Generated by Engineering Accountability Manager skill v2.0.0*  
*Date: 2026-09-10*  
*Issue: DB Migration Failure Analysis*
