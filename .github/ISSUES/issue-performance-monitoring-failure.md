---
name: "CI/CD Failure: Performance Monitoring workflow configuration issues"
date: 2026-08-07
author: github-actions[bot]
labels: [bug, ci-cd, performance, monitoring]
---

## 🚨 CI/CD Failure Report: Performance Monitoring & Benchmarking

### **Workflow**: `performance.yml` - Performance Monitoring & Benchmarking
**Status**: ❌ **FAILED**  
**Run ID**: 31152130137  
**Failed At**: 2026-08-07T05:54:38Z

---

## 📋 Error Details

### Primary Error
```
Unable to locate executable file: pnpm
```

### Full Error Log
```
Run Lighthouse Audits    Set up Node.js    ##[error]Unable to locate executable file: pnpm.
Please verify either the file path exists or the file can be found 
within a directory specified by the PATH environment variable. 
Also check the file mode to verify the file is executable.
```

### Additional Issues Found
1. **Node.js 20 Deprecation Warning**:
   ```
   Node 20 is being deprecated. This workflow is running with Node 24 by default.
   ```

2. **Performance Alerts Job Issues**:
   ```
   ls: cannot access '.performance-history/': No such file or directory
   ```

3. **Multiple Workflow Failures**:
   - Lighthouse CI job failed due to missing pnpm
   - Performance alerts triggered even though main jobs failed
   - Performance history directory not created

---

## 🔍 Root Cause Analysis

### Main Issue
**Missing pnpm Installation**: The performance monitoring workflow uses `actions/setup-node@v4` with `cache: pnpm`, but the workflow doesn't actually install pnpm itself. The Node.js setup action expects pnpm to be available but it's not installed.

### Secondary Issues
1. **Node.js Version**: Using deprecated Node.js 20
2. **Workflow Logic**: Performance alerts job runs even when main jobs fail
3. **Directory Management**: Performance history directory not created before alerts job runs

---

## 📊 Impact Assessment

| Impact Area | Severity | Details |
|------------|----------|---------|
| **Performance Monitoring** | 🔴 **Critical** | Cannot run Lighthouse audits or collect metrics |
| **Performance Tracking** | 🔴 **Critical** | No performance data collection or regression detection |
| **Developer Insights** | 🟡 **Medium** | Cannot track website performance improvements/degradations |
| **CI/CD Reliability** | 🟡 **Medium** | Workflow configuration issues affect multiple jobs |

---

## 🛠️ Required Fixes

### 1. Fix pnpm Installation (🔴 **CRITICAL**)

**Current Problem**: The workflow relies on `actions/setup-node@v4` with `cache: pnpm` but doesn't install pnpm itself.

**Current Configuration**:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'
```

**Required Fix**: Add explicit pnpm installation step

```yaml
# Add this step before using pnpm
- name: Install pnpm
  run: npm install -g pnpm

# Or use the official pnpm action
- uses: pnpm/action-setup@v3
  with:
    version: 10.22.0
```

**Recommended Solution**: Use the official pnpm action

```yaml
jobs:
  lighthouse:
    name: Run Lighthouse Audits
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Set up pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10.22.0
          run_install: false
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
```

### 2. Update Node.js Version (🟡 **HIGH**)

**Current**: Node.js 20 (deprecated)  
**Recommended**: Node.js 22 (LTS)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22  # Updated from 20
```

### 3. Fix Performance Alerts Logic (🟡 **MEDIUM**)

**Current Problem**: The performance alerts job runs even when the main jobs fail, and tries to access non-existent directories.

**Current Configuration**:
```yaml
performance-alerts:
  needs: performance-benchmark
  runs-on: ubuntu-latest
  if: failure()  # This runs when any dependency fails
```

**Recommended Fix**: Add proper conditions and directory creation

```yaml
performance-alerts:
  needs: performance-benchmark
  runs-on: ubuntu-latest
  if: failure() && needs.performance-benchmark.result == 'failure'
  steps:
    - name: Create performance history directory if missing
      run: mkdir -p .performance-history
    
    - name: Performance regression detected
      run: |
        echo "⚠️ Performance regression detected!"
        echo "Check the Lighthouse CI results:"
        echo "https://github.com/hanbini96/HanBin-Baik-Blog/actions"
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Add Error Handling for pnpm in All Jobs (🟢 **LOW**)

**Recommended**: Add explicit pnpm installation to all jobs that use it

```yaml
jobs:
  lighthouse:
    steps:
      - name: Install pnpm
        run: npm install -g pnpm
        
  performance-benchmark:
    steps:
      - name: Install pnpm
        run: npm install -g pnpm
```

---

## 🧪 Testing Strategy

### Test Cases to Verify
1. ✅ **pnpm Installation Test**:
   ```bash
   pnpm --version
   ```
   - Should output pnpm version without errors

2. ✅ **Lighthouse CI Test**:
   ```bash
   pnpm install -g lighthouse @lhci/cli
   lhci autorun
   ```
   - Should run Lighthouse audits successfully

3. ✅ **GitHub Actions Simulation**:
   - Push a fix to a test branch
   - Verify performance workflow passes
   - Check that performance metrics are collected

4. ✅ **Alert Logic Test**:
   - Simulate a workflow failure
   - Verify alerts job runs with proper conditions
   - Verify no errors when accessing directories

---

## 📋 Dependencies & Prerequisites

### Required Before Fix
- [ ] Access to repository code
- [ ] Understanding of performance monitoring requirements
- [ ] GitHub repository admin access for testing

### Required After Fix
- [ ] Test performance workflow locally
- [ ] Commit and push fix to repository
- [ ] Monitor GitHub Actions for successful runs
- [ ] Verify performance metrics are collected
- [ ] Check Lighthouse CI results

---

## 🎯 Priority & Timeline

**Priority**: 🔴 **CRITICAL** - Blocks performance monitoring and insights

**Suggested Timeline**:
- **Immediate**: Fix pnpm installation (within 4-8 hours)
- **Today**: Update Node.js version and fix alerts logic
- **This Week**: Add error handling and documentation

---

## 🔗 Related Resources

- [pnpm Installation Guide](https://pnpm.io/installation)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [GitHub Actions pnpm Setup](https://github.com/marketplace/actions/setup-pnpm)
- [Node.js Version Management](https://nodejs.org/en/about/releases/)

---

## 📝 Notes

### 🔍 Current Workflow Structure Analysis

The performance monitoring workflow has several jobs with dependencies:

```
lighthouse
  ↓
performance-benchmark
  ↓
performance-summary
  ↓
performance-alerts (runs on failure)
```

**Issues Identified**:
1. The `lighthouse` job fails because pnpm is not available
2. The `performance-alerts` job runs even when the main workflow fails
3. The alerts job tries to access `.performance-history/` directory which may not exist

### 🛠️ Complete Workflow Fix

Here's the complete recommended fix for the performance.yml workflow:

```yaml
jobs:
  lighthouse:
    name: Run Lighthouse Audits
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Set up pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 10.22.0
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      
      - name: Install lighthouse
        run: pnpm install -g lighthouse @lhci/cli
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://hanbini96.github.io/HanBin-Baik-Blog/
            https://hanbini96.github.io/HanBin-Baik-Blog/blog
            https://hanbini96.github.io/HanBin-Baik-Blog/about
          uploadArtifacts: true
          temporaryPublicStorage: true
          configPath: ./lighthouserc.js
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          LHCI_TOKEN: ${{ secrets.LHCI_TOKEN }}
```

---

**Automatically generated by GitHub Actions monitoring system**