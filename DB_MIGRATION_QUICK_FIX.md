# 🚀 DB Migration Quick Fix Guide

**Last Updated:** 2026-09-10  
**Status:** CRITICAL - All migrations failing  
**Time to Fix:** ~15 minutes

---

## ❌ The Problem

All DB migration workflows failing with:
```
❌ ERROR: Cannot connect to staging database
```

**This has been broken since August 26th!**

---

## ✅ The Solution (3 Steps)

### Step 1: Run Diagnostic Workflow
```bash
gh workflow run test-db-connection.yml
```

This will tell you EXACTLY why the connection is failing.

### Step 2: Fix Database URL Format
The STAGING_DB_URL secret needs this format:
```
postgresql://postgres:PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require
```

**Fix it:**
```bash
gh secret set STAGING_DB_URL --body "postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres?sslmode=require"
```

### Step 3: Replace Migration Placeholders
```bash
MIGRATION_USER_UUID=$(gh secret get MIGRATION_USER_UUID --json value -q '.value')
MIGRATION_USER_PASSWORD=$(gh secret get MIGRATION_USER_PASSWORD --json value -q '.value')

find supabase/migrations -name "*.sql" -type f -exec \
  sed -i "s/PLACEHOLDER_UUID/$MIGRATION_USER_UUID/g" {} +

find supabase/migrations -name "*.sql" -type f -exec \
  sed -i "s/PLACEHOLDER_PASSWORD/$MIGRATION_USER_PASSWORD/g" {} +
```

### Step 4: Run Migration Workflow
```bash
gh workflow run db.yml
```

---

## 📋 What I Created For You

✅ **`test-db-connection.yml`** - Diagnostic workflow to find exact error
✅ **`DB_MIGRATION_FAILURE_ANALYSIS.md`** - Complete analysis (200+ lines)
✅ **`DB_MIGRATION_QUICK_FIX.md`** - This quick guide
✅ **`PR_136_AUDIT_REPORT.md`** - PR #136 audit from earlier
✅ **`PR_136_QUICK_AUDIT.md`** - Quick PR audit summary

---

## 🔍 What's Wrong (Summary)

1. **Database connection failing** - STAGING_DB_URL format incorrect or inaccessible
2. **Migration files have placeholders** - PLACEHOLDER_UUID still in files
3. **Network restrictions** - Database not accessible from GitHub Actions

---

## 📊 Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| DB Connection | ❌ Failing | ✅ Working |
| Migration Workflow | ❌ Failing | ✅ Passing |
| CI/CD Pipeline | ❌ Broken | ✅ Functional |
| Placeholders | ❌ Present | ✅ Replaced |

---

## 🚨 Critical Notes

**This is blocking:**
- New features requiring database changes
- CI/CD pipeline functionality
- Database migration automation
- Production deployments

**Fix Priority:** HIGH - Required for project progress

---

## 📞 Need Help?

1. Run: `gh workflow run test-db-connection.yml`
2. Share the output with me
3. I'll give you the exact fix

---

**🎯 Run the diagnostic workflow NOW to get started!**

---

*Engineering Accountability Manager v2.0.0 | Generated: 2026-09-10*