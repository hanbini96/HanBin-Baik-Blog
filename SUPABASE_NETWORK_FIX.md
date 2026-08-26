# 🔧 Supabase Network Restrictions Fix

## Issue #126: db.yml workflow consistently failing due to network restrictions

### Problem
The `Supabase DB Migrations` workflow is failing with 100% failure rate because GitHub Actions runner IP addresses are blocked by Supabase's network restrictions.

### Root Cause
Supabase's free tier has network restrictions that only allow connections from specific IP addresses. GitHub Actions runners use dynamic IP addresses that change frequently, and these are often blocked by default.

### Error Message
```
failed to connect to postgres: failed to connect to `host=db.***.supabase.co user=postgres database=postgres`:
dial error (connect ECONNREFUSED 2600:1f16:1ce4:1c01:208b:1383:dc55:20d7:5432)

Make sure your local IP is allowed in Network Restrictions and Network Bans.
https://supabase.com/dashboard/project/_/database/settings
```

### Solution
Add GitHub Actions IP ranges to Supabase Network Restrictions allowlist.

### GitHub Actions IP Ranges to Add
```
192.30.252.0/22
185.199.108.133
140.82.112.0/20
143.55.64.0/20
```

### Steps to Fix

#### 1. Go to Supabase Dashboard
Open your browser and navigate to:
```
https://supabase.com/dashboard/project/_/database/settings
```

#### 2. Navigate to Network Restrictions
Scroll to the "Network Restrictions" section in the Database settings.

#### 3. Add IP Ranges to Allowlist
Add the following IP ranges:

**IPv4 Ranges:**
```
192.30.252.0/22
185.199.108.133
140.82.112.0/20
143.55.64.0/20
```

**Note:** GitHub Actions primarily uses IPv4 addresses. The IPv6 address in the error message is just one of many possible IPs.

#### 4. Save Settings
Click "Save" to apply the network restrictions.

#### 5. Retry Workflow
Go to GitHub Actions and retry the failed db.yml workflow run.

### Verification
After adding the IPs to the allowlist:

```bash
# Check workflow status
gh run list --limit 5 --workflow "Supabase DB Migrations"

# Expected: All runs should show SUCCESS status
```

### Workflow File Status
Current db.yml workflow file has been enhanced with:
- ✅ Comprehensive network diagnostics
- ✅ Actionable error messages
- ✅ Multiple solution options
- ✅ Troubleshooting steps
- ✅ Direct links to Supabase settings

### Related Files
- `.github/workflows/db.yml` - Enhanced with better error handling
- `SUPABASE_NETWORK_FIX.md` - This documentation

### References
- Supabase Network Restrictions: https://supabase.com/docs/guides/database/networking
- GitHub Actions IP Ranges: https://docs.github.com/en/actions/learn-github-actions/managing-self-hosted-runners/about-self-hosted-runners#runner-ip-addresses
- Issue #126: Supabase DB workflow failures

### Status
✅ **Fix Applied**: Network restrictions documentation created
⏳ **Pending**: Supabase dashboard configuration (manual step)
🔄 **Verification**: After Supabase configuration, workflow should succeed

---

**Created**: August 26, 2026  
**Branch**: fix/supabase-network-restrictions  
**Issue**: #126  
**Status**: Documentation complete, awaiting Supabase configuration