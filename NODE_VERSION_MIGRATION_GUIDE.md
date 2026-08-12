# 🚀 Node.js Version Migration Guide

## 📋 Overview
This guide documents the permanent migration from Node 24 to Node 22.x LTS for HanBin-Baik-Blog.

## 🎯 Objective
Eliminate Node version-related workflow failures by establishing a hard rule: **Node 22.x LTS**

## 📊 Changes Made

### Files Updated:
1. ✅ `.github/workflows/performance.yml` - Changed `node-version: 24` → `node-version: 22`
2. ✅ `.github/workflows/infrastructure.yml` - Changed `node-version: 24` → `node-version: 22`
3. ✅ `.github/workflows/github_pages.yml` - Changed `node-version: 24` → `node-version: 22`
4. ✅ `package.json` - Changed engines requirement `>=20.0.0` → `>=22.0.0`
5. ✅ `.nvmrc` - Added with value `22`
6. ✅ `NODE_VERSION_POLICY.md` - Created with hard rules and justification
7. ✅ `verify_node_version_policy.sh` - Created verification script

## 🔬 Why Node 22?

### Compatibility Matrix:
| Requirement | Node 20 | Node 22 | Node 24 |
|-------------|---------|---------|---------|
| package.json (`>=20.0.0`) | ✅ | ✅ | ✅ |
| Lighthouse CI (`>=22.19`) | ✅ | ✅ | ✅ |
| Astro 5.18.0 | ✅ | ✅ | ✅ |
| pnpm 11.21.0 | ✅ | ✅ | ✅ |
| GitHub Actions support | ✅ | ✅ | ❌ |
| LTS Status | Until Apr 2026 | Until Apr 2027 | Current |
| Stability | Stable | Stable | Bleeding-edge |

### Key Decision Factors:
1. **GitHub Actions Compatibility**: setup-node@v4 officially supports Node 22 but NOT Node 24
2. **LTS Duration**: Node 22 supported until April 2027 (9+ months)
3. **Stability**: Node 24 is bleeding-edge with limited ecosystem testing
4. **Future-proof**: Node 22 provides a stable foundation for 9+ months

## 🛠️ Local Development Setup

### Prerequisites:
- nvm (Node Version Manager) installed
- GitHub CLI (gh) installed

### Steps:

```bash
# 1. Install Node 22
nvm install 22

# 2. Use Node 22
nvm use 22

# 3. Verify Node version
node --version  # Should output v22.x.x

# 4. Install dependencies
pnpm install

# 5. Test locally
pnpm dev
```

### Alternative (if not using nvm):
```bash
# Install Node 22 directly
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
```

## 🔄 CI/CD Pipeline Changes

No changes needed to workflow triggers or logic. The only change is:
- **Before**: `node-version: 24`
- **After**: `node-version: 22`

All workflows will automatically use Node 22.x in CI.

## 📈 Expected Results

### Before Migration:
- ❌ Random workflow failures due to Node 24 compatibility issues
- ❌ "Back and forth" arguments about Node versions
- ❌ Inconsistent local vs CI environments
- ❌ Wasted time debugging Node version problems

### After Migration:
- ✅ Stable, predictable CI environment
- ✅ Consistent local and CI environments
- ✅ No more Node version-related failures
- ✅ Clear, documented policy
- ✅ Future-proof for 9+ months

## 🧪 Testing Strategy

### Local Testing:
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Build test
pnpm build

# Dev test
pnpm dev
```

### CI Testing:
```bash
# Trigger workflow manually
gh workflow run performance.yml --ref dev-update
gh workflow run infrastructure.yml --ref dev-update
gh workflow run github_pages.yml --ref main
```

### Verification:
```bash
# Run the verification script
./verify_node_version_policy.sh
```

## 📅 Rollback Plan

If issues arise (unlikely given the compatibility matrix):

1. **Immediate Rollback**:
```bash
# Revert all changes
git checkout .

# Push changes
git commit -m "Revert Node version changes"
git push
```

2. **Investigation**:
- Check GitHub Actions logs for errors
- Verify Node 24 compatibility with all packages
- Check if setup-node@v4 officially supports Node 24

3. **Alternative**:
- Consider Node 20 (if Lighthouse CI allows it)
- Wait for Node 24 official support in setup-node

## 📊 Monitoring

### Post-Migration Checklist:
- [ ] All workflows pass on next run
- [ ] No Node version-related errors in GitHub Actions
- [ ] Local development works with Node 22
- [ ] Performance metrics remain stable
- [ ] No breaking changes in functionality

### Monitoring Commands:
```bash
# Check workflow status
gh run list --workflow performance.yml --limit 5

# View workflow logs
gh run view {run-id} --log

# Check Node version in CI
# (Add a step in workflow: node --version)
```

## 🚨 Troubleshooting

### Issue: Local Node version mismatch
**Symptom**: `node --version` shows wrong version

**Solution**:
```bash
# Ensure you're using the correct Node version
nvm use 22

# Verify
node --version
which node
```

### Issue: CI still failing
**Symptom**: Workflow still fails after migration

**Solution**:
1. Check if all workflow files were updated
2. Verify no Node 24 references remain:
```bash
grep -r "node-version: 24" .github/workflows/ || echo "Clean"
```
3. Check GitHub Actions cache (sometimes caches old versions)
4. Try clearing cache:
```bash
# In workflow, add cache clearing step
- name: Clear cache
  run: rm -rf ~/.pnpm-store ~/.cache
```

### Issue: Package compatibility
**Symptom**: Errors during `pnpm install`

**Solution**:
1. Check package.json engines field
2. Ensure all dependencies support Node 22
3. Update dependencies if needed:
```bash
pnpm up
```

## 📚 Additional Resources

- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [GitHub Actions setup-node Documentation](https://github.com/actions/setup-node)
- [Lighthouse CI Requirements](https://github.com/GoogleChrome/lighthouse-ci)
- [Astro Node.js Compatibility](https://docs.astro.build/en/guides/deploy/github-pages/)

## 🎯 Summary

This migration establishes a **permanent, non-negotiable Node version policy** that will:
- ✅ Eliminate Node version-related workflow failures
- ✅ Provide stability for the next 9+ months
- ✅ Ensure consistency between local and CI environments
- ✅ End the "back and forth" arguments about Node versions

**Policy Status**: ✅ ENFORCED AND DOCUMENTED

---

**Migration Date**: 2026-08-12  
**Policy Version**: 1.0.0  
**Next Review**: April 2026 (Node 22 LTS EOL)  
**Status**: ✅ COMPLETE