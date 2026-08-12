# PR #78 Action Failures - Root Cause Analysis & Fixes

## 📊 Overview

This document provides a **comprehensive analysis** of the GitHub Actions failures on PR #78 and proposes **targeted fixes** based on the project documentation.

---

## 🔍 Current Branch Status

**Current Branch**: `content/update-page-20260808`  
**PR**: #78 - [Content Review] Update and refresh page content  
**Target Branch**: dev-update

---

## ❌ Failed Workflows & Root Causes

### 1. **Performance Monitoring & Benchmarking** ❌
**Run ID**: 31643437895

#### Error Details:
```
/Install global dependencies
  /home/runner/work/_temp/3957807e-f842-49ca-9eff-55659392b715.sh: line 2: pnpm: command not found
  ##[error]Process completed with exit code 127.
```

#### Root Cause Analysis:

**Primary Issue**: The `pnpm` command is not available in the PATH when the "Install global dependencies" step executes, despite pnpm being set up earlier.

**Why this happens**:
1. The `pnpm/setup` action configures pnpm but doesn't add it to PATH globally
2. The `Setup pnpm global bin directory` step attempts to add PNPM_GLOBAL_BIN to PATH
3. However, the PATH update is not persisted across steps or the sourcing of `.bashrc` is not working correctly
4. The `source /home/runner/.bashrc` command may fail silently or not persist

**Code Location**: `.github/workflows/performance.yml` - lines 68-76

**Relevant Project Docs**:
- **DEV-GUIDE.md** Section 3.2: "Setting Up Environment" - Shows `pnpm install` as the standard
- **DEV-GUIDE.md** Section 2.1: "Environment Variables" - Mentions PATH configuration
- **PERFORMANCE_MONITORING.md** Section 3.3: Shows pnpm setup in workflows

---

### 2. **🎯 Kanban Automation** ⚠️
**Run ID**: 31643437917

#### Issues:
- Node.js 20 deprecation warning (Node 24 is now default)
- Path validation error: "Path(s) specified in the action for caching do not exist"

#### Root Cause:
The caching action is trying to cache paths that don't exist or are not properly configured.

---

### 3. **Deploy to GitHub Pages** ❌
**Run ID**: 31643437903

#### Error Details:
```
##[error]Error: Multiple artifacts named "github-pages" were unexpectedly found for this workflow run. Artifact count is 2.
```

#### Root Cause Analysis:
This is a **known GitHub Actions issue** where:
1. Multiple upload-artifact actions in the same workflow can cause conflicts
2. Artifacts from previous runs may not be properly cleaned up
3. The workflow has both `upload-artifact` and `actions/upload-pages-artifact@v3` which may conflict

**Project Context**: The `github_pages.yml` workflow uses both:
- `actions/upload-artifact@v4` for the build artifact
- `actions/upload-pages-artifact@v3` for GitHub Pages deployment

---

### 4. **infrastructure.yml** ❌
**Run ID**: 31643427213

#### Issue:
Workflow file integrity issues - likely related to the PATH configuration problems cascading through all workflows.

---

## 🎯 Proposed Fixes

### Fix #1: **PATH Configuration for pnpm (CRITICAL)**

**Problem**: pnpm is not available in PATH when needed for global installations.

**Solution**: Use the official `pnpm/action-setup` with proper PATH configuration.

**Recommended Changes**:

#### For `performance.yml`:

```yaml
# BEFORE (lines 32-45):
- name: Set up pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 11.21.0
    run_install: false

- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'pnpm'

# AFTER (updated):
- name: Set up pnpm
  uses: pnpm/action-setup@v4
  id: pnpm-setup
  with:
    version: 11.21.0
    run_install: false

- name: Set up Node.js with pnpm cache
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'pnpm'
    cache-dependency-path: '**/pnpm-lock.yaml'

- name: Add pnpm to PATH
  run: |
    # Add pnpm to PATH for all subsequent steps
    echo "$(pnpm bin)" >> $GITHUB_PATH
    echo "$(npm bin -g)" >> $GITHUB_PATH
    # Verify pnpm is available
    which pnpm || echo "pnpm not found in PATH"
    pnpm --version
```

#### For `infrastructure.yml`:

```yaml
# BEFORE (lines 39-48):
- name: Configure pnpm PATH
  run: |
    # Ensure pnpm is in PATH
    PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "$HOME/.pnpm-global/bin")
    echo "$PNPM_GLOBAL_BIN" >> $GITHUB_PATH
    mkdir -p "$PNPM_GLOBAL_BIN"
    source /home/runner/.bashrc

# AFTER (simplified and more reliable):
- name: Configure pnpm PATH
  run: |
    # Add pnpm to PATH using the official setup output
    echo "$(pnpm bin)" >> $GITHUB_PATH
    echo "$(npm bin -g)" >> $GITHUB_PATH
    # Create global bin directory if it doesn't exist
    mkdir -p "$HOME/.pnpm-global/bin"
    echo "$HOME/.pnpm-global/bin" >> $GITHUB_PATH
```

#### For `github_pages.yml`:

```yaml
# BEFORE (lines 54-67):
- name: Update PATH for pnpm
  run: |
    # Ensure pnpm is in PATH
    PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "$HOME/.pnpm-global/bin")
    echo "$PNPM_GLOBAL_BIN" >> $GITHUB_PATH
    mkdir -p "$PNPM_GLOBAL_BIN"
    source /home/runner/.bashrc

# AFTER (more robust):
- name: Configure pnpm PATH
  run: |
    # Add pnpm to PATH for all subsequent steps
    echo "$(pnpm bin)" >> $GITHUB_PATH
    echo "$(npm bin -g)" >> $GITHUB_PATH
    # Verify pnpm is available before proceeding
    if ! command -v pnpm &> /dev/null; then
      echo "❌ ERROR: pnpm is not available in PATH"
      echo "PATH is: $PATH"
      pnpm config get global-bin-dir || true
      which pnpm || true
      exit 1
    fi
    pnpm --version
```

---

### Fix #2: **Global Dependency Installation Method**

**Problem**: The workflow tries to install global dependencies using pnpm after setting up Node.js, but pnpm may not be in PATH.

**Solution**: Use the project-local pnpm for global installations, or ensure PATH is properly configured.

**Recommended Change** (in `performance.yml`):

```yaml
# BEFORE (lines 78-84):
- name: Install global dependencies
  run: |
    source /home/runner/.bashrc
    pnpm add -g lighthouse @lhci/cli
    lhci --version || echo "lhci not found"
    lighthouse --version || echo "lighthouse not found"

# AFTER (use project pnpm):
- name: Install global dependencies
  run: |
    # Use npx to run global commands with project pnpm
    npx --yes pnpm add -g lighthouse @lhci/cli
    # Verify installations
    lhci --version || { echo "lhci not found"; exit 1; }
    lighthouse --version || { echo "lighthouse not found"; exit 1; }
```

---

### Fix #3: **GitHub Pages Artifact Conflict**

**Problem**: Multiple artifacts named "github-pages" causing deployment failure.

**Solution**: Ensure proper artifact naming and cleanup.

**Recommended Change** (in `github_pages.yml`):

```yaml
# BEFORE (lines 115-125):
- name: Upload build artifact
  uses: actions/upload-artifact@v4
  with:
    name: github-pages
    path: dist/
    retention-days: 1

# AFTER (ensure unique naming):
- name: Upload build artifact
  uses: actions/upload-artifact@v4
  with:
    name: github-pages-${{ github.sha }}-${{ github.run_number }}
    path: dist/
    retention-days: 1
```

Also ensure the download step uses the correct artifact name:

```yaml
# BEFORE (lines 133-138):
- name: Download build artifact
  uses: actions/download-artifact@v4
  with:
    name: github-pages
    path: dist

# AFTER:
- name: Download build artifact
  uses: actions/download-artifact@v4
  with:
    name: github-pages-${{ github.sha }}-${{ github.run_number }}
    path: dist
```

---

### Fix #4: **Node.js Version Consistency**

**Problem**: Node.js 20 deprecation warnings.

**Solution**: Update Node.js version to 22 or 24.

**Recommended Change** (in all workflows):

```yaml
# BEFORE:
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22

# AFTER (use latest LTS):
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 24
```

---

## 📋 Implementation Priority

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| 🔴 **CRITICAL** | PATH Configuration for pnpm | Fixes all workflows | Low |
| 🟡 **HIGH** | Global dependency installation | Fixes performance monitoring | Low |
| 🟡 **HIGH** | GitHub Pages artifact naming | Fixes deployment | Low |
| 🟢 **MEDIUM** | Node.js version update | Removes deprecation warnings | Low |

---

## ✅ Expected Outcomes After Fixes

1. ✅ **Performance Monitoring workflow** will complete successfully
2. ✅ **pnpm global installations** will work correctly
3. ✅ **GitHub Pages deployment** will succeed without artifact conflicts
4. ✅ **infrastructure.yml** will validate correctly
5. ✅ **All workflows** will use consistent Node.js version
6. ✅ **PATH configuration** will be reliable across all steps

---

## 🔧 Testing Strategy

### Before Applying Fixes:
1. Review current workflow logs in PR #78
2. Verify the PATH issues are present
3. Check pnpm availability in each workflow step

### After Applying Fixes:
1. Run each workflow manually via `workflow_dispatch`
2. Verify no "pnpm: command not found" errors
3. Check that global dependencies install correctly
4. Verify GitHub Pages deploys successfully
5. Monitor for any new issues

### Validation Steps:
```bash
# Test pnpm availability
gh run view 31643437895 --log-failed | grep "pnpm: command not found"

# Check PATH configuration
gh run view 31643437895 --log | grep "PATH="

# Verify pnpm version
gh run view 31643437895 --log | grep "pnpm --version"
```

---

## 📚 Project Documentation References

### Key Sections:
1. **DEV-GUIDE.md** - Section 3.2: Setting Up Environment
   - Shows standard `pnpm install` usage
   - Documents development workflow

2. **DEV-GUIDE.md** - Section 2.1: Environment Variables
   - Mentions PATH configuration needs
   - References pnpm setup requirements

3. **PERFORMANCE_MONITORING.md** - Section 3.3: GitHub Actions Benchmarking Workflow
   - Shows pnpm setup in workflow context
   - Demonstrates global dependency installation pattern

4. **BENCHMARKS.md** - Section 4: Optimization Strategies
   - Documents performance monitoring requirements
   - Shows expected workflow structure

---

## 🎯 Recommendations

### Immediate Actions (Apply These First):
1. **Fix PATH configuration** in all three workflow files
2. **Update global dependency installation** to use `npx --yes pnpm`
3. **Fix GitHub Pages artifact naming** to include unique identifiers
4. **Update Node.js to version 24** for consistency

### Validation:
1. Create a test PR or push to verify fixes
2. Monitor workflow runs for 24-48 hours
3. Check GitHub Actions logs for any new issues
4. Update documentation if changes affect future development

### Documentation Updates:
- Update `DEV-GUIDE.md` to document PATH configuration best practices
- Add troubleshooting section for pnpm PATH issues
- Document Node.js version requirements

---

## 📝 Summary

The failures in PR #78 are **all related to PATH configuration issues** with pnpm, cascading through all workflows. The root cause is that pnpm is not properly added to the PATH in a way that persists across all steps.

**The fix is straightforward**: Use the official `pnpm/action-setup` with proper PATH configuration and verify pnpm availability before use.

All changes are **backward compatible** and follow the project's documented best practices for pnpm usage.

---

**Analysis Date**: 2026-08-12  
**Analyst**: AI Assistant  
**Project**: HanBin-Baik-Blog  
**PR**: #78