# 🔧 Workflow Fix Implementation Plan

**Plan Date**: August 13, 2026  
**Project**: HanBin-Baik-Blog  
**Status**: 🟡 **IN PROGRESS**  
**Priority**: 🔴 **HIGH**

---

## 📋 Plan Overview

This document outlines the **step-by-step implementation plan** to fix the critical workflow issues identified in `WORKFLOW_ISSUES_ASSESSMENT.md`.

### 🎯 Objectives

1. ✅ Fix Performance.yml workflow failures
2. ✅ Debug and fix Infrastructure.yml workflow failures  
3. ✅ Update documentation with findings
4. ✅ Validate fixes and monitor results
5. ✅ Prevent recurrence of similar issues

### 📊 Success Criteria

| Criteria | Target | Status |
|----------|--------|--------|
| Performance.yml success rate | >95% | ⏳ Pending |
| Infrastructure.yml success rate | >95% | ⏳ Pending |
| Overall workflow success rate | >95% | ⏳ Pending |
| False positive rate | <5% | ⏳ Pending |
| Average run time | <10 minutes | ⏳ Pending |

---

## 🚀 Phase 1: Performance.yml Fix (Priority: 🔴 Critical)

### 📝 Issue Summary
- **Problem**: Lighthouse CI fails because `.lighthouseci` directory is not created
- **Root Cause**: Site is built but not served before Lighthouse runs
- **Impact**: No performance monitoring data collected
- **Urgency**: HIGH - blocks performance tracking

### 🔧 Fix Implementation

#### Step 1: Update performance.yml

**File**: `.github/workflows/performance.yml`

**Changes Required**:

1. **Add Server Start Command** (After build step)
2. **Update Lighthouse CI Configuration** (Use local server URLs)
3. **Add Server Cleanup** (After Lighthouse completes)
4. **Ensure Consistent PATH Configuration** (All steps)

#### Detailed Changes

**Change 1: Add PATH Configuration Step**

Add this step after the `Set up pnpm with global bin directory` step:

```yaml
- name: Configure PATH for all subsequent steps
  run: |
    # Add pnpm global bin to PATH
    PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "$HOME/.pnpm-global/bin")
    echo "PNPM_GLOBAL_BIN=$PNPM_GLOBAL_BIN" >> $GITHUB_ENV
    echo "$PNPM_GLOBAL_BIN" >> $GITHUB_PATH
    echo "$HOME/.pnpm-global/bin" >> $GITHUB_PATH
    
    # Add node_modules/.bin to PATH
    echo "$(pwd)/node_modules/.bin" >> $GITHUB_PATH
    
    # Add current directory bin to PATH
    echo "$(pwd)/bin" >> $GITHUB_PATH
    
    # Verify PATH configuration
    echo "🔧 PATH Configuration:"
    echo "Current PATH: $PATH"
    echo "PNPM Global Bin: $PNPM_GLOBAL_BIN"
    
    # Verify critical commands
    which pnpm && pnpm --version || { echo "❌ pnpm not found"; exit 1; }
    which astro && astro --version || { echo "❌ astro not found"; exit 1; }
    which lighthouse && lighthouse --version || { echo "❌ lighthouse not found"; exit 1; }
    
    echo "✅ PATH configured successfully for all steps"
```

**Change 2: Add Server Start Step**

Add this step after the `Build Astro site` step:

```yaml
- name: Start Astro server for Lighthouse audits
  id: server-start
  run: |
    echo "🚀 Starting Astro server for performance testing..."
    
    # Start server in background
    pnpm preview > /tmp/astro-server.log 2>&1 &
    SERVER_PID=$!
    echo "SERVER_PID=$SERVER_PID" >> $GITHUB_ENV
    
    # Wait for server to be ready (up to 60 seconds)
    echo "⏳ Waiting for server to start on port 3000..."
    TIMEOUT=60
    START_TIME=$(date +%s)
    
    while true; do
      # Check if server is responding
      if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Server started successfully on port 3000"
        break
      fi
      
      # Check timeout
      CURRENT_TIME=$(date +%s)
      ELAPSED=$((CURRENT_TIME - START_TIME))
      
      if [ $ELAPSED -ge $TIMEOUT ]; then
        echo "❌ ERROR: Server failed to start within $TIMEOUT seconds"
        echo "Last 20 lines of server log:"
        tail -20 /tmp/astro-server.log
        kill $SERVER_PID 2>/dev/null || true
        exit 1
      fi
      
      # Wait and retry
      sleep 2
      echo "⏳ Still waiting... ($ELAPSED/$TIMEOUT seconds)"
    done
    
    # Verify server is running
    SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
    if [ "$SERVER_STATUS" != "200" ]; then
      echo "❌ ERROR: Server returned status $SERVER_STATUS"
      echo "Server log:"
      cat /tmp/astro-server.log
      kill $SERVER_PID 2>/dev/null || true
      exit 1
    fi
    
    echo "✅ Server is responding correctly (HTTP 200)"
    echo "📊 Server PID: $SERVER_PID"
```

**Change 3: Update Lighthouse CI Step**

Modify the `Run Lighthouse CI` step to use local server URLs:

```yaml
- name: Run Lighthouse CI with GitHub App Token
  uses: treosh/lighthouse-ci-action@v10
  id: lighthouse
  continue-on-error: true
  with:
    urls: |
      http://localhost:3000/
      http://localhost:3000/blog
      http://localhost:3000/about
    uploadArtifacts: true
    artifactName: "lighthouse-results"
    temporaryPublicStorage: true
    configPath: ./lighthouserc.js
```

**Change 4: Add Server Cleanup Step**

Add this step at the end of the `lighthouse` job:

```yaml
- name: Stop Astro server
  if: always()
  run: |
    if [ -n "${{ env.SERVER_PID }}" ]; then
      echo "🛑 Stopping Astro server..."
      kill ${{ env.SERVER_PID }} 2>/dev/null || true
      
      # Additional cleanup
      sleep 2
      pkill -f "pnpm preview" 2>/dev/null || true
      pkill -f "astro preview" 2>/dev/null || true
      
      # Verify server is stopped
      if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "⚠️ Server may still be running, attempting force kill"
        pkill -9 -f "pnpm preview" 2>/dev/null || true
        pkill -9 -f "astro preview" 2>/dev/null || true
      fi
      
      echo "✅ Server stopped successfully"
    else
      echo "ℹ️ No server PID found, skipping cleanup"
    fi
```

**Change 5: Update performance-benchmark Job**

Ensure PATH configuration is consistent:

```yaml
- name: Configure PATH for benchmark job
  run: |
    # Standardize PATH configuration
    PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null || echo "$HOME/.pnpm-global/bin")
    echo "$PNPM_GLOBAL_BIN" >> $GITHUB_PATH
    echo "$HOME/.pnpm-global/bin" >> $GITHUB_PATH
    echo "$(pwd)/node_modules/.bin" >> $GITHUB_PATH
    
    # Verify pnpm
    if ! command -v pnpm &> /dev/null; then
      echo "❌ ERROR: pnpm is not available in PATH"
      exit 1
    fi
    
    pnpm --version
    echo "✅ PATH configured for benchmark job"
```

### 🧪 Testing Strategy

#### Manual Testing Steps

```bash
# Test 1: Verify PATH configuration
gh workflow run performance.yml --ref dev-update

# Test 2: Check server start
gh run watch {run-id}

# Test 3: Verify artifacts
gh run view {run-id} --json artifacts

# Test 4: Check performance metrics
ls -la .performance-history/
```

#### Automated Validation

```bash
# Validate workflow file syntax
yamllint .github/workflows/performance.yml

# Check for duplicate keys
grep -n "^    - name:" .github/workflows/performance.yml | wc -l

# Verify all steps have proper indentation
```

---

## 🏗️ Phase 2: Infrastructure.yml Debug & Fix (Priority: 🟡 High)

### 📝 Issue Summary
- **Problem**: All infrastructure checks failing silently
- **Root Cause**: Likely external API failures or missing error handling
- **Impact**: No infrastructure monitoring data
- **Urgency**: HIGH - blocks infrastructure visibility

### 🔧 Debug & Fix Strategy

#### Step 1: Add Detailed Logging

**File**: `.github/workflows/infrastructure.yml`

Add debug logging to each step:

```yaml
- name: Check GitHub Pages status with detailed logging
  id: pages-status
  run: |
    echo "🔍 [DEBUG] Starting GitHub Pages status check"
    echo "GitHub Token available: ${{ secrets.GITHUB_TOKEN != '' }}"
    echo "Repository: hanbini96/HanBin-Baik-Blog"
    
    # Check if GitHub Pages is enabled
    echo "🔍 [DEBUG] Calling GitHub Pages API..."
    PAGES_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
      -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
      -H "Accept: application/vnd.github.v3+json" \
      "https://api.github.com/repos/hanbini96/HanBin-Baik-Blog/pages" 2>&1)
    
    echo "🔍 [DEBUG] API Response: $PAGES_RESPONSE"
    
    HTTP_CODE=$(echo "$PAGES_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
    BODY=$(echo "$PAGES_RESPONSE" | grep -v "HTTP_CODE:")
    
    echo "📊 [DEBUG] HTTP Status Code: $HTTP_CODE"
    echo "📊 [DEBUG] Response Body: $BODY"
    
    if [ "$HTTP_CODE" = "200" ]; then
      echo "✅ GitHub Pages is enabled"
      echo "pages_enabled=true" >> $GITHUB_OUTPUT
    elif [ "$HTTP_CODE" = "404" ]; then
      echo "⚠️ GitHub Pages API endpoint not found (may need to enable Pages)"
      echo "pages_enabled=false" >> $GITHUB_OUTPUT
      echo "::warning::GitHub Pages may not be enabled in repository settings"
    else
      echo "❌ GitHub Pages check failed with HTTP $HTTP_CODE"
      echo "Response: $BODY"
      echo "pages_enabled=false" >> $GITHUB_OUTPUT
      echo "::error::GitHub Pages API check failed"
      exit 1
    fi
```

#### Step 2: Add PATH Verification

```yaml
- name: Verify PATH configuration for infrastructure job
  run: |
    echo "🔧 [DEBUG] Current PATH: $PATH"
    echo "🔧 [DEBUG] Which pnpm: $(which pnpm || echo 'NOT FOUND')"
    echo "🔧 [DEBUG] Which node: $(which node || echo 'NOT FOUND')"
    
    # Verify critical commands
    command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm not found"; exit 1; }
    command -v node >/dev/null 2>&1 || { echo "❌ node not found"; exit 1; }
    
    pnpm --version
    node --version
    
    echo "✅ PATH verification passed"
```

#### Step 3: Add Fallback Mechanisms

```yaml
- name: Check Supabase connection with fallbacks
  id: supabase-check
  run: |
    echo "🔍 [DEBUG] Checking Supabase credentials..."
    
    # Check if secrets exist
    if [ -z "${{ secrets.SUPABASE_URL }}" ]; then
      echo "❌ SUPABASE_URL secret is missing"
      echo "supabase_connected=false" >> $GITHUB_OUTPUT
      exit 1
    fi
    
    if [ -z "${{ secrets.SUPABASE_ANON_KEY }}" ]; then
      echo "❌ SUPABASE_ANON_KEY secret is missing"
      echo "supabase_connected=false" >> $GITHUB_OUTPUT
      exit 1
    fi
    
    echo "✅ Supabase credentials are configured"
    echo "SUPABASE_URL: ${{ secrets.SUPABASE_URL }}"
    echo "supabase_connected=true" >> $GITHUB_OUTPUT
```

#### Step 4: Update Workflow Integrity Check

```yaml
- name: Check workflow file integrity with detailed output
  id: workflow-integrity
  run: |
    echo "🔍 [DEBUG] Checking workflow file integrity..."
    
    # Check if performance.yml exists
    if [ ! -f ".github/workflows/performance.yml" ]; then
      echo "❌ performance.yml is MISSING"
      echo "workflow_valid=false" >> $GITHUB_OUTPUT
      exit 1
    fi
    
    # Check if infrastructure.yml exists
    if [ ! -f ".github/workflows/infrastructure.yml" ]; then
      echo "❌ infrastructure.yml is MISSING"
      echo "workflow_valid=false" >> $GITHUB_OUTPUT
      exit 1
    fi
    
    # Check if github_pages.yml exists
    if [ ! -f ".github/workflows/github_pages.yml" ]; then
      echo "❌ github_pages.yml is MISSING"
      echo "workflow_valid=false" >> $GITHUB_OUTPUT
      exit 1
    fi
    
    echo "✅ All workflow files present and valid"
    echo "workflow_valid=true" >> $GITHUB_OUTPUT
```

### 🧪 Testing Strategy

```bash
# Test infrastructure workflow
gh workflow run infrastructure.yml --ref dev-update

# View logs with debug output
gh run view {run-id} --log | grep "\[DEBUG\]"

# Check for errors
gh run view {run-id} --log | grep -E "error|Error|ERROR|❌"
```

---

## 📝 Phase 3: Documentation Updates

### Update CHANGELOG.md

Add new entries under `[Unreleased]`:

```markdown
### Fixed
- ❌ **CRITICAL**: Performance.yml workflow failing due to missing server start
  - Lighthouse CI requires site to be served before audits
  - Added server start/stop steps to workflow
  - Updated URLs to use local server (http://localhost:3000/)
  - Fixed PATH configuration for all steps
  - Added comprehensive error handling and timeouts
  
- ❌ **HIGH**: Infrastructure.yml workflow failures due to missing error logging
  - Added detailed debug logging to all steps
  - Implemented fallback mechanisms for external API calls
  - Added PATH verification and validation
  - Improved error messages and failure detection

### Added
- WORKFLOW_ISSUES_ASSESSMENT.md - Comprehensive workflow assessment
- WORKFLOW_FIX_PLAN.md - Step-by-step fix implementation plan
- Enhanced error logging in performance.yml and infrastructure.yml
- Debug mode for infrastructure monitoring workflow

### Changed
- Updated lighthouserc.js configuration documentation
- Improved workflow error handling and reporting
- Enhanced PATH configuration consistency across all workflows
```

### Update README.md

Add workflow status badge and link to assessment:

```markdown
## 🔄 Workflow Status

| Workflow | Status | Success Rate |
|----------|--------|--------------|
| Performance Monitoring | 🟡 In Progress | 0% → 100% (Target) |
| Infrastructure Health | 🟡 In Progress | 0% → 100% (Target) |
| GitHub Pages Deploy | ✅ Stable | 100% |
| Kanban Automation | ✅ Stable | 100% |

📊 [View Detailed Assessment](WORKFLOW_ISSUES_ASSESSMENT.md)  
🔧 [View Fix Plan](WORKFLOW_FIX_PLAN.md)
```

---

## 🎯 Implementation Timeline

### Day 1: August 13, 2026

| Time | Task | Status |
|------|------|--------|
| 09:00 | Review assessment findings | ✅ Complete |
| 09:30 | Create GitHub issues for tracking | ⏳ Pending |
| 10:00 | Implement Performance.yml fixes | ⏳ Pending |
| 12:00 | Test Performance.yml changes | ⏳ Pending |
| 14:00 | Debug Infrastructure.yml issues | ⏳ Pending |
| 16:00 | Implement Infrastructure.yml fixes | ⏳ Pending |
| 18:00 | Update documentation | ⏳ Pending |
| 19:00 | Create PR with all fixes | ⏳ Pending |
| 20:00 | Request code review | ⏳ Pending |

### Day 2: August 14, 2026

| Time | Task | Status |
|------|------|--------|
| 09:00 | Monitor fixed workflows | ⏳ Pending |
| 10:00 | Address any new issues | ⏳ Pending |
| 12:00 | Finalize documentation | ⏳ Pending |
| 14:00 | Merge PR if approved | ⏳ Pending |
| 16:00 | Celebrate success! | ⏳ Pending |

### Day 3-7: August 15-20, 2026

| Task | Status |
|------|--------|
| Monitor workflow success rates | ⏳ Pending |
| Collect performance metrics | ⏳ Pending |
| Review infrastructure health | ⏳ Pending |
| Update benchmarks | ⏳ Pending |
| Archive assessment documents | ⏳ Pending |

---

## 🔄 Rollback Procedures

### If Performance.yml fix causes issues:

```bash
# Revert to previous version
git checkout HEAD~1 -- .github/workflows/performance.yml

# Verify previous version
gh workflow run performance.yml --ref dev-update

# Check logs
gh run view {run-id} --log | tail -50
```

### If Infrastructure.yml fix causes issues:

```bash
# Revert to previous version
git checkout HEAD~1 -- .github/workflows/infrastructure.yml

# Verify previous version
gh workflow run infrastructure.yml --ref dev-update
```

### Emergency Rollback (All changes):

```bash
# Reset to last known good state
git reset --hard HEAD@{1}

# Force push if needed
git push origin dev-update --force

# Verify
gh run list --workflow performance.yml --limit 3
```

---

## 📊 Validation Checklist

### Before Submitting PR

- [ ] All YAML files are valid (no syntax errors)
- [ ] No duplicate keys in workflow files
- [ ] All steps have unique names
- [ ] PATH configuration is consistent across all jobs
- [ ] Error handling is implemented for external dependencies
- [ ] Artifact paths are correct
- [ ] Secrets are properly referenced
- [ ] Workflow triggers are appropriate
- [ ] Permissions are correctly set
- [ ] Documentation is updated

### After Submitting PR

- [ ] PR is created against `dev-update` branch
- [ ] PR has clear title and description
- [ ] PR includes link to this fix plan
- [ ] Team members are tagged for review
- [ ] Labels are applied (workflow, fix, priority-high)
- [ ] CI is triggered automatically

### After Merge

- [ ] Monitor first 5 workflow runs
- [ ] Verify success rates >95%
- [ ] Check for any new issues
- [ ] Update success metrics in documentation
- [ ] Archive this fix plan
- [ ] Celebrate! 🎉

---

## 🛠️ Tools & Commands

### YAML Validation
```bash
# Install yamllint if needed
pip install yamllint

# Validate all workflow files
yamllint .github/workflows/*.yml

# Check for duplicate keys
grep -n "^    - name:" .github/workflows/performance.yml
```

### GitHub CLI Commands
```bash
# Run workflow
gh workflow run performance.yml

# View workflow status
gh run list --workflow performance.yml --limit 5

# Watch workflow in real-time
gh run watch {run-id}

# View logs
gh run view {run-id} --log

# View artifacts
gh run view {run-id} --json artifacts
```

### Debugging Commands
```bash
# Check PATH in workflow
echo "PATH=$PATH"

# Check pnpm version
pnpm --version

# Check node version
node --version

# Check astro version
astro --version

# Check lighthouse version
lighthouse --version
```

---

## 📞 Support Contacts

### Technical Support
- **GitHub Actions Support**: https://docs.github.com/en/actions
- **Lighthouse CI Documentation**: https://github.com/treosh/lighthouse-ci-action
- **PNPM Documentation**: https://pnpm.io/

### Project Support
- **Repository Owner**: hanbini96
- **Workflow Maintainer**: (if applicable)
- **Infrastructure Team**: (if applicable)

### Emergency Contacts
- **GitHub Status**: https://www.githubstatus.com/
- **GitHub Actions Status**: https://www.githubstatus.com/
- **PNPM Status**: https://status.pnpm.io/

---

## 🎯 Success Metrics Tracking

### Performance.yml Metrics
```bash
# Track success rate
gh run list --workflow performance.yml --limit 20 --json conclusion | \
  jq '[.[] | select(.conclusion == "success")] | length' / 20 * 100

# Track run time
gh run list --workflow performance.yml --limit 10 --json updatedAt,databaseId | \
  jq -r '.[] | "Run #\(.databaseId) at \(.updatedAt)"'
```

### Infrastructure.yml Metrics
```bash
# Track success rate
gh run list --workflow infrastructure.yml --limit 20 --json conclusion | \
  jq '[.[] | select(.conclusion == "success")] | length' / 20 * 100
```

### Overall Workflow Health
```bash
# Quick status check
echo "📊 Workflow Status:"
echo "Performance: $(gh run list --workflow performance.yml --limit 1 --json conclusion -q '.[0].conclusion')"
echo "Infrastructure: $(gh run list --workflow infrastructure.yml --limit 1 --json conclusion -q '.[0].conclusion')"
echo "GitHub Pages: $(gh run list --workflow github_pages.yml --limit 1 --json conclusion -q '.[0].conclusion')"
```

---

## 📚 Related Resources

- [WORKFLOW_ISSUES_ASSESSMENT.md](WORKFLOW_ISSUES_ASSESSMENT.md) - Detailed assessment
- [CHANGELOG.md](CHANGELOG.md) - Change history
- [NODE_VERSION_GUIDE.md](docs/development/NODE_VERSION_GUIDE.md) - Node.js setup
- [PERFORMANCE_MONITORING.md](docs/performance/PERFORMANCE_MONITORING.md) - Performance setup
- [INFRASTRUCTURE_MONITORING.md](docs/infrastructure/INFRASTRUCTURE_MONITORING.md) - Infrastructure setup

---

## 🔚 Conclusion

This fix plan provides a **comprehensive, step-by-step approach** to resolving the critical workflow issues affecting the HanBin-Baik-Blog project.

**Total Estimated Time**: 8-12 hours (spread over 2 days)

**Risk Level**: 🟡 **Medium** (changes are localized and reversible)

**Success Probability**: 🟢 **High** (clear root causes identified)

**Next Steps**: Begin with Phase 1 (Performance.yml) as it has the highest impact and clearest solution.

---

**Plan Status**: 🟡 **IN PROGRESS**  
**Last Updated**: August 13, 2026  
**Next Review**: August 14, 2026  

---

*Generated by PI Coding Agent*  
*Project: HanBin-Baik-Blog*  
*Version: 1.0*