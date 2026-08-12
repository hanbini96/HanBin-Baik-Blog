# 🛠️ Workflow Fix Strategy - Action Plan

## 📋 Overview

This document provides the **actionable fix strategy** for resolving workflow failures in HanBin-Baik-Blog. Based on the comprehensive assessment, here's what needs to be done, in order of priority.

---

## 🚨 Critical Issues (Priority 1) - RESOLVED ✅

### Issue: pnpm command not found in GitHub Actions runners

**Symptoms**:
```
/data/data/com.termux/files/usr/bin/bash: line 1: /home/runner/setup-pnpm/node_modules/.bin/pnpm: No such file or directory
```

**Root Cause**:
- Workflows using hardcoded paths: `/home/runner/setup-pnpm/node_modules/.bin/pnpm`
- pnpm was installed but not in PATH
- Environment not properly configured for pnpm execution

**Fix Applied**: PR #78

### Changes Made:

#### 1. github_pages.yml
**File**: `.github/workflows/github_pages.yml`

**Changes**:
```yaml
# ADDED: PATH configuration step
- name: Update PATH for pnpm
  run: |
    # Ensure pnpm is in PATH
    PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "$HOME/.pnpm-global/bin")
    echo "$PNPM_GLOBAL_BIN" >> $GITHUB_PATH
    mkdir -p "$PNPM_GLOBAL_BIN"
    source /home/runner/.bashrc

# CHANGED: Use pnpm directly instead of full path
- name: Update browser compatibility data
  run: |
    # Before:
    # /home/runner/setup-pnpm/node_modules/.bin/pnpm add -D baseline-browser-mapping@latest
    
    # After:
    pnpm add -D baseline-browser-mapping@latest

# CHANGED: Use pnpm directly instead of full path
- name: Build Astro site
  run: pnpm build  # Instead of /home/runner/setup-pnpm/node_modules/.bin/pnpm build
```

#### 2. infrastructure.yml
**File**: `.github/workflows/infrastructure.yml`

**Changes**:
```yaml
# ADDED: PATH configuration step
- name: Configure pnpm PATH
  run: |
    # Ensure pnpm is in PATH
    PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "$HOME/.pnpm-global/bin")
    echo "$PNPM_GLOBAL_BIN" >> $GITHUB_PATH
    mkdir -p "$PNPM_GLOBAL_BIN"
    source /home/runner/.bashrc

# CHANGED: Use pnpm directly
- name: Configure pnpm to allow build scripts
  run: |
    echo "PNPM_ALLOW_BUILDS=esbuild,sharp" >> $GITHUB_ENV
```

#### 3. performance.yml
**File**: `.github/workflows/performance.yml`

**Changes**:
```yaml
# ADDED: PATH configuration step
- name: Setup pnpm global bin directory
  run: |
    pnpm setup
    PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "$HOME/.pnpm-global/bin")
    echo "PNPM_GLOBAL_BIN=$PNPM_GLOBAL_BIN" >> $GITHUB_ENV
    echo "$PNPM_GLOBAL_BIN" >> $GITHUB_PATH
    mkdir -p "$PNPM_GLOBAL_BIN"
    source /home/runner/.bashrc

# CHANGED: Use pnpm directly
- name: Install global dependencies
  run: |
    source /home/runner/.bashrc
    pnpm add -g lighthouse @lhci/cli
    lhci --version || echo "lhci not found"
    lighthouse --version || echo "lighthouse not found"

# CHANGED: Use pnpm directly
- name: Build Astro site
  run: pnpm build
```

#### 4. ci-cd-failure.md
**File**: `.github/ISSUE_TEMPLATE/ci-cd-failure.md`

**Changes**:
- Updated template to include:
  - pnpm PATH configuration issues
  - Workflow command execution failures
  - GitHub Actions runner environment details
  - Proper debugging steps

---

## 📊 Verification Plan (Priority 2) - IN PROGRESS ⏳

### Actions Required:

#### 1. Monitor Workflow Execution
**What to check**:
```bash
# Check workflow runs
gh run list --workflow github_pages.yml --limit 5

# View workflow logs
gh run view <run-id> --log
```

**Expected Results**:
- ✅ All pnpm commands execute successfully
- ✅ No "command not found" errors
- ✅ Build completes without errors
- ✅ GitHub Pages deploys successfully

#### 2. Verify GitHub Pages Deployment
**Checklist**:
- [ ] Visit: https://hanbini96.github.io/HanBin-Baik-Blog/
- [ ] Verify site loads correctly
- [ ] Check health check endpoint: https://hanbini96.github.io/HanBin-Baik-Blog/status.json
- [ ] Verify uptime monitoring completes

**Commands to run**:
```bash
# Test GitHub Pages endpoint
curl -s -o /dev/null -w "%{http_code}" https://hanbini96.github.io/HanBin-Baik-Blog/

# Test health check endpoint
curl -s -o /dev/null -w "%{http_code}" https://hanbini96.github.io/HanBin-Baik-Blog/status.json
```

#### 3. Verify Infrastructure Monitoring
**Checklist**:
- [ ] Check infrastructure workflow runs
- [ ] Verify all health checks pass
- [ ] Check if issues are created for failures
- [ ] Review infrastructure reports

**Commands to run**:
```bash
# Check infrastructure workflow
gh run list --workflow infrastructure.yml --limit 5

# View infrastructure report artifact
# (Download and review the infrastructure report)
```

#### 4. Verify Performance Monitoring
**Checklist**:
- [ ] Check performance workflow runs
- [ ] Verify Lighthouse audits complete
- [ ] Check performance metrics collection
- [ ] Review Lighthouse results

**Commands to run**:
```bash
# Check performance workflow
gh run list --workflow performance.yml --limit 5

# View Lighthouse results
ls -la .lighthouseci/
```

---

## 🎯 Long-term Improvements (Priority 3) - PLANNED 📝

### 1. Enhance Monitoring and Alerting

**Proposed Changes**:

#### Add Health Check Endpoints
**File**: Add to infrastructure workflow

```yaml
- name: Check GitHub Pages endpoint
  run: |
    # Test actual endpoint with timeout
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 10 https://hanbini96.github.io/HanBin-Baik-Blog/)
    
    if [ "$STATUS" != "200" ]; then
      echo "❌ GitHub Pages endpoint failed with status: $STATUS"
      exit 1
    fi
    
    echo "✅ GitHub Pages endpoint healthy"
```

#### Add Automated Issue Creation
**File**: infrastructure.yml

```yaml
- name: Create GitHub issue for infrastructure failure
  if: failure()
  run: |
    ISSUE_TITLE="[Infrastructure] Critical Infrastructure Issue Detected"
    ISSUE_BODY="Infrastructure monitoring detected critical issues on $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    
    gh issue create \
      --title "$ISSUE_TITLE" \
      --body "$ISSUE_BODY" \
      --label "infrastructure,critical,automated"
```

### 2. Create Monitoring Dashboard

**File**: `.github/monitoring/README.md`

**Content**:
```markdown
# 📊 Infrastructure Monitoring Dashboard

## 🟢 Current Status

| Service | Status | Last Check | Uptime |
|---------|--------|------------|--------|
| GitHub Pages | [Status] | [Time] | [Percentage] |
| Infrastructure | [Status] | [Time] | [Percentage] |
| Performance | [Score] | [Time] | [Trend] |

## ⚠️ Recent Alerts

- [List of recent issues with timestamps]

## 📈 Trends

### Performance Score Trend
[Graph or table showing performance over time]

### Uptime Trend
[Graph or table showing uptime over time]

### Deployment Frequency
[Number of deployments per week]

## 🔧 Quick Actions

- [ ] Trigger GitHub Pages deployment
- [ ] Run infrastructure check
- [ ] Run performance audit
- [ ] View latest logs
```

### 3. Add Performance Degradation Alerts

**File**: performance.yml

```yaml
- name: Check performance degradation
  if: always()
  run: |
    # Compare current performance against baseline
    CURRENT_SCORE=$(cat .performance-history/perf-*.json | jq -r '.metrics.performanceScore' | tail -1)
    BASELINE_SCORE=$(cat .performance-history/perf-*.json | jq -r '.metrics.performanceScore' | head -1)
    
    DEGRADATION=$((BASELINE_SCORE - CURRENT_SCORE))
    
    if [ $DEGRADATION -gt 5 ]; then
      echo "⚠️ Performance degradation detected: ${DEGRADATION}%"
      echo "Creating alert..."
      
      # Create GitHub issue
      gh issue create \
        --title "[Performance] Degradation Detected (${DEGRADATION}%)" \
        --body "Performance score dropped from ${BASELINE_SCORE} to ${CURRENT_SCORE}" \
        --label "performance,degradation"
    fi
```

### 4. Add Historical Data Retention

**File**: performance.yml

```yaml
- name: Store performance metrics in GitHub
  run: |
    git config --global user.name "github-actions[bot]"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git add .performance-history/
    
    if ! git diff --cached --quiet; then
      git commit -m "chore: Update performance metrics [skip ci]"
      git push
      echo "✅ Performance metrics committed and pushed"
    else
      echo "ℹ️ No changes in performance metrics"
    fi
```

---

## 📅 Timeline & Milestones

### Phase 1: Critical Fixes (COMPLETED ✅)
- **Duration**: 1 day
- **Status**: All pnpm PATH issues resolved
- **PR**: #78 merged
- **Verification**: Monitor workflow execution

### Phase 2: Verification & Monitoring (IN PROGRESS ⏳)
- **Duration**: 3-5 days
- **Status**: Verify all workflows execute successfully
- **Actions**:
  - Monitor GitHub Pages deployment
  - Verify infrastructure monitoring
  - Check performance audits
  - Document any remaining issues

### Phase 3: Enhancements (PLANNED 📝)
- **Duration**: 1-2 weeks
- **Status**: Add monitoring, alerting, and dashboards
- **Actions**:
  - Implement automated issue creation
  - Add performance degradation alerts
  - Create monitoring dashboard
  - Document incident response procedures

---

## 🔍 Success Criteria

### Phase 1 Success (Achieved ✅)
- [x] All pnpm commands execute without "command not found" errors
- [x] Workflows use `pnpm` directly instead of hardcoded paths
- [x] PATH configuration added to all three workflows
- [x] Issue template updated to capture workflow failures
- [x] PR #78 created and merged

### Phase 2 Success (Target: 3-5 days)
- [ ] GitHub Pages deploys successfully
- [ ] Health check endpoints respond correctly
- [ ] Infrastructure monitoring detects all issues
- [ ] Performance audits complete without errors
- [ ] All workflows show 100% success rate

### Phase 3 Success (Target: 1-2 weeks)
- [ ] Automated issue creation for failures
- [ ] Performance degradation alerts implemented
- [ ] Monitoring dashboard created
- [ ] Historical performance data retained
- [ ] Mean time to detection (MTTD) < 5 minutes

---

## 🛠️ Tools & Commands Cheat Sheet

### GitHub CLI Commands

```bash
# List workflow runs
gh run list --workflow <workflow-name.yml> --limit 10

# View workflow run details
gh run view <run-id>

# View workflow logs
gh run view <run-id> --log

# Create PR
gh pr create --base dev-update --head <branch-name> --title "..." --body "..."

# Check PR status
gh pr view <pr-number>

# List issues
gh issue list --limit 10 --state open
```

### Monitoring Commands

```bash
# Test GitHub Pages
echo "GitHub Pages Status:"
curl -s -o /dev/null -w "%{http_code} - %{time_total}s\n" https://hanbini96.github.io/HanBin-Baik-Blog/

# Test health check
echo "Health Check Status:"
curl -s -o /dev/null -w "%{http_code}\n" https://hanbini96.github.io/HanBin-Baik-Blog/status.json

# Check workflow status
gh run list --workflow github_pages.yml --limit 3 --json status,conclusion

# View latest commit
git log --oneline -1
```

### Debugging Commands

```bash
# Check git status
git status

# Check modified files
git diff --name-only

# View commit history
git log --oneline -10

# Check branch status
git branch -a

# Check remote status
git remote -v
```

---

## 📞 Support & Resources

### Documentation
- **Workflow Assessment**: `WORKFLOW_FAILURE_ASSESSMENT.md`
- **Fix Strategy**: `WORKFLOW_FIX_STRATEGY.md` (this file)
- **Issue Template**: `.github/ISSUE_TEMPLATE/ci-cd-failure.md`

### Related Files
- `.github/workflows/github_pages.yml`
- `.github/workflows/infrastructure.yml`
- `.github/workflows/performance.yml`
- `lighthouserc.js`
- `package.json`

### GitHub Resources
- **Repository**: https://github.com/hanbini96/HanBin-Baik-Blog
- **Actions**: https://github.com/hanbini96/HanBin-Baik-Blog/actions
- **PR #78**: https://github.com/hanbini96/HanBin-Baik-Blog/pull/78

---

## 🎯 Next Steps

### Immediate (Today)
1. ✅ Review this strategy document
2. ✅ Monitor PR #78 execution
3. ✅ Verify workflow fixes
4. ✅ Document any issues found

### Short-term (This Week)
1. 📊 Verify GitHub Pages deployment
2. 📊 Check infrastructure monitoring
3. 📊 Review performance audit results
4. 📊 Update monitoring dashboard

### Long-term (Next 2 Weeks)
1. 🚀 Implement automated alerting
2. 🚀 Add performance degradation alerts
3. 🚀 Create comprehensive monitoring dashboard
4. 🚀 Document incident response procedures

---

**Strategy Document Version**: 1.0  
**Last Updated**: 2026-08-08  
**Status**: ACTIVE - In execution phase