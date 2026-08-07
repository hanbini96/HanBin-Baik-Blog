---
name: "CI/CD Failure: Supabase DB Migrations workflow failing"
date: 2026-08-07
author: github-actions[bot]
labels: [bug, ci-cd, database]
---

## 🚨 CI/CD Failure Report: Supabase DB Migrations

### **Workflow**: `db.yml` - Supabase DB Migrations
**Status**: ❌ **FAILED**  
**Run ID**: 31152130097  
**Failed At**: 2026-08-07T05:54:30Z

---

## 📋 Error Details

### Primary Error
```
STAGING_DB_URL secret is missing
```

### Full Error Log
```
Apply migrations to STAGING    Push migrations to STAGING    STAGING_DB_URL secret is missing
Apply migrations to STAGING    Push migrations to STAGING    ##[error]Process completed with exit code 1.
```

### Additional Issues Found
1. **Supabase CLI Installation Failed**:
   ```
   curl: (6) Could not resolve host: cli.supabase.com
   ```

2. **Node.js 20 Deprecation Warning**:
   ```
   Node 20 is being deprecated. This workflow is running with Node 24 by default.
   ```

---

## 🔍 Root Cause Analysis

### Main Issue
The `STAGING_DB_URL` GitHub Actions secret is **not configured** in the repository secrets. The workflow requires this secret to connect to the staging database.

### Secondary Issues
1. **Network Dependency**: The workflow depends on external network access to download Supabase CLI
2. **Node.js Version**: Using deprecated Node.js 20 in a workflow that's forced to run on Node.js 24

---

## 📊 Impact Assessment

| Impact Area | Severity | Details |
|------------|----------|---------|
| **Database Deployments** | 🔴 **Critical** | Cannot deploy migrations to staging database |
| **Production Deployments** | 🟡 **Medium** | Production deployment is manual and would fail next |
| **CI/CD Reliability** | 🟡 **Medium** | Network dependency makes workflow fragile |
| **Developer Experience** | 🟡 **Medium** | Developers cannot test database changes automatically |

---

## 🛠️ Required Fixes

### 1. Add Missing Secrets (HIGH PRIORITY)

**Action Required**: Add the following secrets to GitHub repository settings:

- `STAGING_DB_URL` - Database connection URL for staging environment
- `PROD_DB_URL` - Database connection URL for production environment (for future use)

**How to Add**:
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with the appropriate database connection string

**Example Database URL Format**:
```
postgresql://username:password@db.supabase.co:5432/postgres?search_path=public&sslmode=require
```

### 2. Fix Supabase CLI Installation (MEDIUM PRIORITY)

**Current Code**:
```yaml
- name: Install Supabase CLI
  run: |
    curl -fsSL https://cli.supabase.com/install/linux | sh
    echo "$HOME/.supabase/bin" >> $GITHUB_PATH
```

**Recommended Fix**:
```yaml
- name: Install Supabase CLI
  run: |
    # Use a more reliable installation method
    mkdir -p $HOME/.supabase/bin
    curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_$(uname)_$(uname -m) -o $HOME/.supabase/bin/supabase
    chmod +x $HOME/.supabase/bin/supabase
    echo "$HOME/.supabase/bin" >> $GITHUB_PATH
```

### 3. Update Node.js Version (LOW PRIORITY)

**Current**: Using Node.js 20 which is deprecated
**Recommended**: Update to Node.js 22 (LTS)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22  # Updated from 20
```

---

## 🧪 Testing Strategy

### Test Cases to Verify
1. ✅ **Secrets Configuration**:
   - Add test secrets
   - Run workflow manually
   - Verify migrations are applied successfully

2. ✅ **CLI Installation**:
   - Test CLI installation step in isolation
   - Verify CLI version and functionality

3. ✅ **Full Workflow**:
   - Trigger on push to main branch
   - Verify staging deployment succeeds
   - Verify production deployment (manual approval required)

---

## 📋 Dependencies & Prerequisites

### Required Before Fix
- [ ] Database connection strings available from Supabase dashboard
- [ ] Admin access to GitHub repository settings
- [ ] Understanding of database migration process

### Required After Fix
- [ ] Test database migration on staging environment
- [ ] Verify no breaking changes in migrations
- [ ] Update documentation if needed

---

## 🎯 Priority & Timeline

**Priority**: 🔴 **CRITICAL** - Blocks database deployments

**Suggested Timeline**:
- **Immediate**: Add missing secrets (within 24 hours)
- **This Week**: Fix CLI installation method
- **Next Sprint**: Update Node.js version and other improvements

---

## 🔗 Related Resources

- [Supabase CLI Installation Guide](https://supabase.com/docs/guides/cli)
- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Database Connection Strings Format](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

## 📝 Notes

- This issue was automatically detected by GitHub Actions monitoring
- The failure occurred during a main branch push
- Production deployment is currently blocked until this is resolved
- Manual intervention may be required to add the secrets

---

**Automatically generated by GitHub Actions monitoring system**