# 🧹 HanBin-Baik-Blog Cleanup Plan

## 📋 Current State Analysis

### Temporary/Summary Files Identified (Should Clean Up):

#### Root Directory Summary Files (Duplicate Information):
- `ACTION_PLAN.md` - Initial planning document (can be archived)
- `WORKFLOW_FAILURE_ASSESSMENT.md` - Initial assessment (historical)
- `WORKFLOW_FIXES_SUMMARY.md` - Detailed workflow fixes (historical)
- `WORKFLOW_FIX_SUMMARY.md` - Alternative summary (historical)
- `WORKFLOW_FIXES_SUMMARY.md` - Another variant (historical)
- `WORKFLOW_FIX_VALIDATION.md` - Validation plan (historical)
- `FIXES_COMPLETED_SUMMARY.md` - Completed fixes summary (historical)
- `DEPLOYMENT_SUMMARY.md` - Deployment summary (historical)

#### Node Version Documentation (Can Consolidate):
- `NODE_VERSION_FIX_SUMMARY.md` - Node fix summary
- `NODE_VERSION_MIGRATION_GUIDE.md` - Migration guide
- `NODE_VERSION_POLICY.md` - Policy document
- `NODE_VERSION_QUICK_REFERENCE.md` - Quick reference

#### Issue Tracking Files (Should Archive):
- `.github/ISSUES/CI_CD_FAILURES_SUMMARY.md`
- `.github/ISSUES/ci-cd-deployment-failures-2026-08-07.md`
- `.github/ISSUES/ci-cd-failures-summary-2026-08-08.md`
- `.github/ISSUES/issue-db-migrations-failure.md`
- `.github/ISSUES/issue-github-pages-failure.md`
- `.github/ISSUES/issue-performance-monitoring-failure.md`
- `.github/ISSUES/ke-issue-tracking-enhancement.md`

### Files to Keep (Essential Documentation):

#### Core Project Files:
- `README.md` - Main project documentation
- `BENCHMARKS.md` - Performance benchmarks
- `DEV-GUIDE.md` - Development guide

#### Configuration Files:
- `astro.config.mjs` - Astro configuration
- `lighthouserc.js` - Lighthouse configuration
- `package.json` - Project dependencies
- `pnpm-lock.yaml` - Dependency lock file

#### Workflow Files:
- `.github/workflows/performance.yml` - Performance monitoring
- `.github/workflows/infrastructure.yml` - Infrastructure monitoring
- `.github/workflows/github_pages.yml` - GitHub Pages deployment

#### Essential Documentation:
- `PERFORMANCE_MONITORING.md` - Performance monitoring setup
- `INFRASTRUCTURE_MONITORING.md` - Infrastructure monitoring setup
- `LIGHTHOUSE_SETUP.md` - Lighthouse setup guide
- `NODE_VERSION_POLICY.md` - Node version policy

## 🎯 Cleanup Strategy

### Phase 1: Archive Historical Documentation
**Action**: Move historical summary files to `.github/ARCHIVE/` directory
**Rationale**: Preserve history while decluttering main directory

### Phase 2: Consolidate Node Version Documentation
**Action**: Merge node version docs into single `NODE_VERSION_GUIDE.md`
**Rationale**: Reduce duplication, single source of truth

### Phase 3: Archive Issue Tracking Files
**Action**: Move `.github/ISSUES/` to `.github/ARCHIVE/issues/`
**Rationale**: These are historical tracking files, not active issues

### Phase 4: Create Proper Changelog
**Action**: Create `CHANGELOG.md` following standard conventions
**Rationale**: Professional project documentation

### Phase 5: Final Validation
**Action**: Verify all workflows still function after cleanup
**Rationale**: Ensure no accidental breakage

## ✅ Expected Outcome

### Clean Directory Structure:
```
📁 ./
├── 📄 README.md
├── 📄 BENCHMARKS.md
├── 📄 DEV-GUIDE.md
├── 📄 CHANGELOG.md (NEW)
├── 📄 NODE_VERSION_GUIDE.md (MERGED)
├── 📁 .github/
│   ├── 📁 workflows/
│   │   ├── 📄 performance.yml
│   │   ├── 📄 infrastructure.yml
│   │   └── 📄 github_pages.yml
│   ├── 📁 ARCHIVE/
│   │   ├── 📄 ACTION_PLAN.md
│   │   ├── 📄 WORKFLOW_FAILURE_ASSESSMENT.md
│   │   ├── 📄 WORKFLOW_FIXES_SUMMARY.md
│   │   ├── 📄 ... (all historical files)
│   │   └── 📁 issues/
│   │       └── 📄 (all issue tracking files)
│   └── 📄 (essential files remain)
```

### Benefits:
1. ✅ Clean, professional project structure
2. ✅ Single source of truth for documentation
3. ✅ Historical context preserved in ARCHIVE
4. ✅ Proper changelog for version tracking
5. ✅ Reduced duplication and confusion
6. ✅ Easier onboarding for new contributors

---

**Status**: 📋 Plan Created
**Next**: Execute cleanup phases
**Owner**: Coding Assistant
**Date**: August 12, 2026