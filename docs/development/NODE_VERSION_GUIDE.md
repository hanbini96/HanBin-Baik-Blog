# 📋 Node.js Version Management Guide - HanBin-Baik-Blog

## 🎯 Overview

This guide consolidates all Node.js version-related documentation for the HanBin-Baik-Blog project. It serves as the **single source of truth** for Node.js version policy, migration guides, and troubleshooting.

---

## 📖 Table of Contents

1. [Node Version Policy](#-node-version-policy)
2. [Current Version Status](#-current-version-status)
3. [Migration History](#-migration-history)
4. [Setup Instructions](#-setup-instructions)
5. [Troubleshooting](#-troubleshooting)
6. [Quick Reference](#-quick-reference)

---

## 🔒 Node Version Policy

### 📜 Official Policy

> **HanBin-Baik-Blog Node.js Version Policy**:
> **Only Node.js 22.x LTS** is permitted in production workflows.
> 
> This is a **hard requirement** with no exceptions.

### 📅 Policy Rationale

| Requirement | Value | Justification |
|------------|-------|---------------|
| **Node.js 22.x LTS** | ✅ Required | Officially supported by GitHub Actions |
| **Support Period** | 9+ months | Until April 2027 |
| **Stability** | ✅ High | LTS release with long-term support |
| **Compatibility** | ✅ Full | All dependencies support Node 22 |
| **Future-Proof** | ✅ Yes | Next 9+ months of stability |

### 🚫 What's Not Allowed

- ❌ Node.js 24.x (incompatible with GitHub Actions at this time)
- ❌ Node.js 20.x (end of life, no LTS support)
- ❌ Node.js 18.x (end of life, no LTS support)
- ❌ Any non-LTS version
- ❌ Invalid pnpm/action-setup@v4 parameters (e.g., `ignore-off: true`)

### 📋 Enforcement

The policy is enforced through:
1. ✅ `.nvmrc` file containing `22`
2. ✅ `engines` field in `package.json` requiring `>=22.0.0`
3. ✅ GitHub Actions workflows using `node-version: 22`
4. ✅ Automated verification scripts

---

## 📊 Current Version Status

### Production Environment

| Environment | Node Version | Status |
|-------------|--------------|--------|
| GitHub Actions (all workflows) | 22.x LTS | ✅ Active |
| Local Development | 22.x LTS | ✅ Active |
| Production Builds | 22.x LTS | ✅ Active |

### Version Details

```bash
# Node.js version
$ node --version
v22.x.x

# npm version
$ npm --version
10.x.x

# pnpm version
$ pnpm --version
11.x.x
```

### Dependency Compatibility

All project dependencies are compatible with Node.js 22:

- ✅ Astro (latest)
- ✅ TypeScript
- ✅ pnpm
- ✅ Lighthouse CI
- ✅ Sharp (image processing)
- ✅ esbuild (build tool)
- ✅ All GitHub Actions

---

## 📜 Migration History

### Migration Timeline

| Date | From Version | To Version | Reason |
|------|--------------|------------|--------|
| Aug 2026 | Node 24 | Node 22 | GitHub Actions compatibility |
| Jul 2026 | Node 22 | Node 24 | Initial setup (later reverted) |
| Jun 2026 | Node 20 | Node 22 | Initial LTS migration |

### Detailed Migration Records

#### Migration #1: Node 20 → Node 22 (June 2026)

**Trigger**: GitHub Actions workflow failures due to Node version incompatibilities

**Changes Made**:
- Updated `.nvmrc` from `20` to `22`
- Updated `package.json` engines from `>=20.0.0` to `>=22.0.0`
- Updated GitHub Actions workflows to use `node-version: 22`
- Updated all workflow files:
  - `.github/workflows/performance.yml`
  - `.github/workflows/infrastructure.yml`
  - `.github/workflows/github_pages.yml`

**Validation**:
```bash
# Verify all workflows use Node 22
grep "node-version:" .github/workflows/*.yml
# Expected: All show node-version: 22
```

**Result**: ✅ All workflows functional, no more random failures

#### Migration #2: Node 22 → Node 24 → Node 22 (July-August 2026)

**Trigger**: Node 24 incompatibilities discovered in GitHub Actions

**Changes Made**:
- Updated workflows to Node 24 (temporary)
- Discovered build script failures
- Reverted to Node 22 with proper configuration
- Added `pnpm approve-builds esbuild sharp` commands

**Validation**:
```bash
# Verify Node 22 is used
grep "node-version:" .github/workflows/*.yml
# Expected: All show node-version: 22
```

**Result**: ✅ Stable configuration with Node 22

---

## ⚠️ CRITICAL: Tilde Expansion in GitHub Actions

### 🚨 Important Note for GitHub Actions Configuration

**In GitHub Actions, the tilde (`~`) character does NOT expand** to the home directory, unlike in local shell environments.

**Incorrect Configuration** (will cause failures):
```ini
# .npmrc file
global-bin-dir=~/.pnpm-global/bin
```

**Correct Configuration** (required for GitHub Actions):
```ini
# .npmrc file
global-bin-dir=/home/runner/.pnpm-global/bin
```

**Why This Matters**:
- GitHub Actions runner does NOT perform shell expansion
- pnpm returns the literal string `~/.pnpm-global/bin`
- This creates invalid paths like `/home/runner/setup-pnpm/node_modules/.bin/bin`
- Results in "pnpm: command not found" or path errors

**Fix Applied**: Updated `.npmrc` to use absolute path (Issue #99)

---

## 🛠️ Setup Instructions

### For New Contributors

#### 1. Install Node.js 22.x LTS

**Option A: Using nvm (Recommended)**

```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js 22.x LTS
nvm install 22
nvm use 22

# Verify
node --version  # Should show v22.x.x
```

**Option B: Direct Download**

Download from [Node.js official website](https://nodejs.org/):
- Download Node.js 22.x LTS installer
- Run installer
- Verify: `node --version`

#### 2. Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm

# Verify
pnpm --version  # Should show 11.x.x or later
```

#### 3. Clone Repository

```bash
# Clone the repository
git clone https://github.com/hanbini96/HanBin-Baik-Blog.git
cd HanBin-Baik-Blog

# Use correct Node version
nvm use 22  # If using nvm

# Install dependencies
pnpm install
```

#### 4. Verify Setup

```bash
# Check Node version
node --version  # v22.x.x

# Check pnpm version
pnpm --version  # 11.x.x

# Check project configuration
cat .nvmrc  # Should show "22"
cat package.json | grep engines  # Should show ">=22.0.0"
```

### For Existing Contributors

#### Update Existing Setup

```bash
# Switch to Node 22
nvm install 22
nvm use 22

# Update global packages
npm install -g pnpm@latest

# Clean and reinstall dependencies
pnpm store prune
rm -rf node_modules
pnpm install

# Verify
node --version  # v22.x.x
pnpm --version  # 11.x.x
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Wrong Node Version in CI

**Symptoms**:
- Workflow failures with Node version errors
- Error messages about Node 24 incompatibilities

**Check**:
```bash
grep "node-version:" .github/workflows/*.yml
```

**Solution**:
```bash
# Update all workflow files to use node-version: 22
sed -i 's/node-version: 24/node-version: 22/g' .github/workflows/*.yml
sed -i 's/node-version: 20/node-version: 22/g' .github/workflows/*.yml
```

**Validation**:
```bash
grep "node-version:" .github/workflows/*.yml
# All should show node-version: 22
```

#### Issue 1b: Invalid pnpm/action-setup@v4 Parameters (NEW)

**Symptoms**:
- `Unexpected input(s) 'ignore-off'` warnings in workflow logs
- pnpm not found despite setup step being present
- PATH configuration failures
- Error: `Unable to locate executable file: pnpm`

**Check**:
```bash
grep "ignore-off" .github/workflows/*.yml
# Should return no results
```

**Solution**:
```bash
# Remove invalid parameter from pnpm/action-setup@v4
sed -i '/ignore-off: true/d' .github/workflows/*.yml
```

**Validation**:
```bash
# Verify pnpm/setup action only has valid inputs
grep -A 5 "pnpm/action-setup@v4" .github/workflows/performance.yml
# Expected inputs: version, dest, run_install, cache, cache_dependency_path, package_json_file, standalone
```

**Related Issues**: #95, #99

#### Issue 2: Build Script Failures

**Symptoms**:
- Errors about ignored build scripts
- `[ERR_PNPM_IGNORED_BUILDS]` messages

**Check**:
```bash
grep "pnpm approve-builds" .github/workflows/performance.yml
```

**Solution**:
```bash
# Add pnpm approve-builds to performance.yml
# Should appear in 2 locations in the workflow
```

**Example Fix**:
```yaml
- name: Configure pnpm to allow build scripts
  run: |
    echo "Setting PNPM_ALLOW_BUILDS environment variable..."
    echo "PNPM_ALLOW_BUILDS=esbuild,sharp" >> $GITHUB_ENV
    
    echo "Configuring pnpm globally..."
    pnpm config set ignore-scripts false
    
    echo "Approving build scripts for required dependencies..."
    pnpm approve-builds esbuild sharp
    
    echo "Installing dependencies..."
    pnpm install
```

#### Issue 3: Local Development Issues

**Symptoms**:
- Different Node version locally vs CI
- Dependency installation failures

**Check**:
```bash
node --version
cat .nvmrc
```

**Solution**:
```bash
# Ensure you're using Node 22
nvm use 22

# Clear and reinstall dependencies
pnpm store prune
rm -rf node_modules
pnpm install
```

#### Issue 3b: PATH Configuration with pnpm bin -g (NEW)

**Symptoms**:
- `Configure pnpm PATH and verify availability` step failing with exit code 1
- Error: pnpm command not found when running `pnpm bin -g`
- PATH not properly configured despite setup steps

**Root Cause**:
- `pnpm bin -g` requires pnpm to be in PATH first
- Circular dependency: PATH config needs pnpm, but pnpm needs PATH

**Check**:
```bash
grep -A 10 "Configure pnpm PATH" .github/workflows/performance.yml
```

**Solution**:
```bash
# Use hardcoded fallback path instead of pnpm bin -g
# Change from:
PNPM_GLOBAL_BIN=$(pnpm bin -g)

# To:
PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "/home/runner/.pnpm-global/bin")
```

**Validation**:
```bash
# Verify PATH configuration uses fallback
grep "pnpm bin -g" .github/workflows/performance.yml
# Should return no results

grep "global-bin-dir" .github/workflows/performance.yml
# Should show the fallback configuration
```

**Related Issues**: #95, #99

#### Issue 4: Package.json Engines Mismatch

**Symptoms**:
- Warnings about engine compatibility
- Dependency installation issues

**Check**:
```bash
cat package.json | grep engines
```

**Solution**:
```bash
# Update engines field in package.json
sed -i 's/"engines": ">=20.0.0"/"engines": ">=22.0.0"/g' package.json
```

---

## 📚 Quick Reference

### 🔧 One-Liner Commands

```bash
# Verify Node version
node --version && echo "✅ Node 22.x LTS"

# Verify pnpm version
pnpm --version && echo "✅ pnpm 11.x"

# Verify project configuration
[ "$(cat .nvmrc)" = "22" ] && echo "✅ .nvmrc correct" || echo "❌ Update .nvmrc"
[ "$(cat package.json | grep -o '"engines": ".*"' | grep -o '>=22')" ] && echo "✅ Engines correct" || echo "❌ Update package.json"

# Verify workflows
grep -c "node-version: 22" .github/workflows/*.yml | grep -q "3" && echo "✅ All 3 workflows use Node 22" || echo "❌ Update workflows"
```

### 📝 Configuration Files

**`.nvmrc`**
```
22
```

**`package.json`** (engines field)
```json
{
  "engines": {
    "node": ">=22.0.0"
  }
}
```

**GitHub Actions Workflow Example**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
```

### 📊 Version Checklist

- [ ] Node.js 22.x LTS installed
- [ ] pnpm 11.x+ installed
- [ ] `.nvmrc` contains `22`
- [ ] `package.json` engines require `>=22.0.0`
- [ ] All workflows use `node-version: 22`
- [ ] `pnpm approve-builds esbuild sharp` in performance.yml
- [ ] Dependencies installed with `pnpm install`

---

## 🔍 Verification Scripts

### Automated Verification

Create a verification script at `.github/scripts/verify-node-version.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Node Version Verification"
echo "============================"
echo

# Check Node version
NODE_VERSION=$(node --version)
if [[ $NODE_VERSION == v22* ]]; then
    echo "✅ Node version: $NODE_VERSION"
else
    echo "❌ Wrong Node version: $NODE_VERSION (expected v22.x.x)"
    exit 1
fi

# Check .nvmrc
NVMRC_VERSION=$(cat .nvmrc)
if [ "$NVMRC_VERSION" = "22" ]; then
    echo "✅ .nvmrc: $NVMRC_VERSION"
else
    echo "❌ Wrong .nvmrc version: $NVMRC_VERSION (expected 22)"
    exit 1
fi

# Check package.json engines
ENGINES=$(cat package.json | grep -o '"engines": ".*"')
if echo "$ENGINES" | grep -q ">=22"; then
    echo "✅ package.json engines: $ENGINES"
else
    echo "❌ Wrong package.json engines: $ENGINES"
    exit 1
fi

# Check workflows
WORKFLOW_COUNT=$(grep -c "node-version: 22" .github/workflows/*.yml)
if [ "$WORKFLOW_COUNT" -eq 3 ]; then
    echo "✅ All 3 workflows use node-version: 22"
else
    echo "❌ Only $WORKFLOW_COUNT workflows use node-version: 22 (expected 3)"
    exit 1
fi

# Check pnpm approve-builds
APPROVE_COUNT=$(grep -c "pnpm approve-builds" .github/workflows/performance.yml)
if [ "$APPROVE_COUNT" -ge 2 ]; then
    echo "✅ pnpm approve-builds present ($APPROVE_COUNT locations)"
else
    echo "❌ pnpm approve-builds missing or insufficient ($APPROVE_COUNT locations, expected >=2)"
    exit 1
fi

echo
echo "🎉 All Node version checks passed!"
echo "✅ Ready for development and CI/CD"
```

Make it executable:
```bash
chmod +x .github/scripts/verify-node-version.sh
```

Run it:
```bash
.github/scripts/verify-node-version.sh
```

---

## 📅 Maintenance Schedule

### Regular Checks

| Frequency | Task | Command |
|-----------|------|---------|
| Weekly | Verify Node version in CI | `grep "node-version:" .github/workflows/*.yml` |
| Monthly | Check Node.js LTS status | Visit [Node.js website](https://nodejs.org/) |
| Quarterly | Update Node version if needed | Follow migration guide |
| Annually | Review Node version policy | Update this guide |

### Next Review Date

**Node.js 22.x LTS End of Life**: April 2027

**Next Policy Review**: April 2026 (9 months before EOL)

---

## 🆘 Support & Resources

### Official Resources

- [Node.js Official Website](https://nodejs.org/)
- [Node.js LTS Schedule](https://nodejs.org/en/about/releases/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [pnpm Documentation](https://pnpm.io/)

### Project-Specific Resources

- This guide: `NODE_VERSION_GUIDE.md`
- Node version policy: See [Node Version Policy](#-node-version-policy) section
- Troubleshooting: See [Troubleshooting](#-troubleshooting) section
- Quick reference: See [Quick Reference](#-quick-reference) section

### Contact

For Node.js version issues:
1. Check this guide
2. Run verification script
3. Check GitHub Actions logs
4. Review workflow files

---

## 📝 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Aug 2026 | Initial consolidation of Node version docs | Coding Assistant |
| 1.1 | Aug 2026 | Added verification scripts and maintenance schedule | Coding Assistant |
| 1.2 | Aug 2026 | Added troubleshooting section | Coding Assistant |
| 1.3 | Aug 2026 | Added Issue 1b (invalid pnpm parameters) and Issue 3b (pnpm bin -g fix) | Coding Assistant |

---

## 🎉 Conclusion

The HanBin-Baik-Blog project now has:
- ✅ **Single source of truth** for Node.js version management
- ✅ **Clear policy** with hard requirements
- ✅ **Easy setup** for new contributors
- ✅ **Troubleshooting guide** for common issues
- ✅ **Automated verification** for CI/CD
- ✅ **Future-proof** configuration (9+ months stability)

**All contributors must use Node.js 22.x LTS.**

---

**Guide Created**: August 12, 2026  
**Last Updated**: August 12, 2026  
**Status**: ✅ Active and Enforced  
**Next Review**: April 2026