# 🚀 Node Version Quick Reference

## 📋 The Rule (Hard Rule - No Exceptions)

**Use Node 22.x LTS everywhere**

## 🔧 Configuration

### Local Development:
```bash
# Use Node 22
nvm use 22

# Verify
node --version  # Should show v22.x.x
```

### CI/CD:
All workflows automatically use Node 22 (no changes needed)

## 📁 Files to Check

| File | Expected Value |
|------|----------------|
| `.nvmrc` | `22` |
| `package.json` (engines.node) | `>=22.0.0` |
| Workflows | `node-version: 22` |

## ✅ Verification

```bash
# Quick check
grep -r "node-version:" .github/workflows/

# Should only show: node-version: 22

# Full verification
./verify_node_version_policy.sh
```

## ❌ What NOT to do

- ❌ Use Node 20 (Lighthouse requires >=22.19)
- ❌ Use Node 24 (not officially supported by GitHub Actions)
- ❌ Change Node version without updating policy
- ❌ Ignore this rule

## 📞 Help

If something doesn't work:
1. Run: `./verify_node_version_policy.sh`
2. Check: `NODE_VERSION_FIX_SUMMARY.md`
3. Review: `NODE_VERSION_MIGRATION_GUIDE.md`

## 🎯 Remember

This policy exists to:
- ✅ Eliminate workflow failures
- ✅ Save time
- ✅ Ensure consistency
- ✅ Provide stability

**No more Node version chaos!** 🎉

---

**Policy Version**: 1.0.0  
**Last Updated**: 2026-08-12  
**Next Review**: April 2026