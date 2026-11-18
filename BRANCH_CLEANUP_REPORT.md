# Branch Cleanup Report

**Generated:** November 18, 2026  
**Repository:** hanbini96/HanBin-Baik-Blog  
**Total Branches:** 32

---

## 📊 Branch Analysis

### ✅ **PROTECTED BRANCHES (3) - Never Delete**
These branches are protected and should never be deleted:
- `main` - Primary branch
- `dev-update` - Development branch (protected)
- `gh-pages` - GitHub Pages deployment branch

### 🟢 **RECENT BRANCHES (3) - Keep**
Branches with recent activity (within 30 days):
- `feat/inquiry-emails` - Last commit: Nov 16, 2026 (2 days ago)
- `ci/supabase-pipeline` - Last commit: Nov 16, 2026 (2 days ago)
- `fix/magic-link-redirect` - Last commit: Nov 16, 2026 (2 days ago)

### 🟡 **STALE BRANCHES (26) - Recommended for Deletion**
Branches older than 30 days with no recent activity:

#### August 2026 (13 branches)
- `claude/lighthouse-dedupe-rows` - Aug 26, 2026
- `fix/cicd-pipeline-restoration` - Aug 26, 2026
- `fix/pr-1-chrome-headless-fix` - Aug 26, 2026
- `fix/supabase-cli-dns-issue` - Aug 26, 2026
- `fix/supabase-cli-linking` - Aug 26, 2026
- `fix/cicd-restoration` - Aug 13, 2026
- `fix/issue-80-cicd-recovery` - Aug 13, 2026
- `fix/issue-97-kanban-caching` - Aug 13, 2026
- `fix/perf-infra-workflow-yaml-indentation-107` - Aug 14, 2026
- `fix/perf-workflow-failure` - Aug 13, 2026
- `fix/pnpm-build-scripts-blocked-60` - Aug 29, 2026
- `fix/workflow-failures-issue-103` - Aug 13, 2026
- `fix/workflow-failures-pnpm-path` - Aug 13, 2026

#### September 2026 (13 branches)
- `audit-2026-09-09` - Sep 10, 2026
- `claude/db-workflow-fixes` - Sep 10, 2026
- `claude/pr-115-workflow-audit-wb3bbg` - Aug 17, 2026
- `dev-update` - Sep 10, 2026 (PROTECTED - DO NOT DELETE)
- `docs/branch-strategy` - Aug 14, 2026
- `feature/fix-db-migration-failures-2026-09-10` - Sep 10, 2026
- `feature/professional-readme-update` - Aug 17, 2026
- `fix/db-conntection-9-9-26` - Sep 10, 2026
- `fix/db-workflow-registration-20260909-214027` - Sep 10, 2026
- `fix/test-db-connection-ssl-bug-20260909-214844` - Sep 10, 2026
- `fix/workflow-permissions-issue-105` - Aug 13, 2026
- `fix/workflow-pnpm-cache-consolidation` - Aug 14, 2026
- `fix/workflow-protection-update` - Aug 17, 2026
- `hanbin/db-migration-automation` - Sep 4, 2026
- `issue/86-workflow-failures-analysis` - Aug 13, 2026

---

## 🗑️ **RECOMMENDED DELETION LIST**

### High Priority (Older than 60 days)
```bash
# August 2026 branches
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/claude/lighthouse-dedupe-rows
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/cicd-pipeline-restoration
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/pr-1-chrome-headless-fix
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/supabase-cli-dns-issue
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/supabase-cli-linking
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/cicd-restoration
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/issue-80-cicd-recovery
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/issue-97-kanban-caching
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/perf-infra-workflow-yaml-indentation-107
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/perf-workflow-failure
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/pnpm-build-scripts-blocked-60
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/workflow-failures-issue-103
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/workflow-failures-pnpm-path
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/workflow-permissions-issue-105
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/workflow-pnpm-cache-consolidation
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/workflow-protection-update
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/docs/branch-strategy
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/feature/professional-readme-update
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/issue/86-workflow-failures-analysis
```

### Medium Priority (30-60 days old)
```bash
# September 2026 branches
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/audit-2026-09-09
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/claude/db-workflow-fixes
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/claude/pr-115-workflow-audit-wb3bbg
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/feature/fix-db-migration-failures-2026-09-10
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/db-conntection-9-9-26
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/db-workflow-registration-20260909-214027
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/fix/test-db-connection-ssl-bug-20260909-214844
gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/hanbin/db-migration-automation
```

---

## 📈 **Impact Analysis**

### Before Cleanup
- **Total Branches:** 32
- **Protected:** 3
- **Recent:** 3
- **Stale:** 26

### After Cleanup
- **Total Branches:** 6
- **Reduction:** 81.25%
- **Improvement:** Much cleaner repository

---

## ⚠️ **WARNINGS**

1. **Verify Branch Status:** Before deleting, check if any branches have open PRs
2. **Backup Important Work:** Some branches may contain valuable work
3. **Check Dependencies:** Some workflows might reference specific branches
4. **Team Coordination:** Notify team members before mass deletion

---

## 🎯 **RECOMMENDED ACTIONS**

### Step 1: Verify No Open PRs
```bash
# Check for open PRs on branches to be deleted
for branch in $(echo "claude/lighthouse-dedupe-rows fix/cicd-pipeline-restoration ..." | tr ' ' '\n'); do
  gh pr list --head $branch --state open 2>/dev/null && echo "⚠️  Open PR found for $branch"
done
```

### Step 2: Delete in Batches
Delete branches in batches of 5-10 to avoid rate limiting:
```bash
# Example: Delete first 5 branches
for branch in claude/lighthouse-dedupe-rows fix/cicd-pipeline-restoration fix/pr-1-chrome-headless-fix fix/supabase-cli-dns-issue fix/supabase-cli-linking; do
  echo "Deleting $branch..."
  gh api -X DELETE repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/$branch
  sleep 1
done
```

### Step 3: Verify Cleanup
```bash
# List remaining branches
gh api repos/hanbini96/HanBin-Baik-Blog/git/refs/heads | jq -r '.[] | .ref' | sed 's|refs/heads/||' | sort
```

---

## 📝 **Notes**

- Branch `dev-update` is protected and should NOT be deleted
- Branch `feat/inquiry-emails` has recent commits (Nov 16) - keep it
- Branch `ci/supabase-pipeline` has recent commits (Nov 16) - keep it
- Branch `fix/magic-link-redirect` has recent commits (Nov 16) - keep it
- All other branches are older than 30 days and can be safely deleted

---

**Status:** ⏳ Pending Review  
**Next Step:** Execute cleanup after verification
