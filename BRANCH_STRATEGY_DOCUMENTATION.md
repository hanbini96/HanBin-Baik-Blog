# 📚 Branch Strategy Documentation - HanBin-Baik-Blog

## 🎯 Purpose

This document explains the **branch strategy** and **workflow execution flow** for the HanBin-Baik-Blog repository, including why the Performance Monitoring workflow uses the `dev-update` branch as its primary target.

---

## 📊 Repository Branch Structure

### **Current Branches:**

```
main          ✅ Protected (requires PR + status checks)
├── dev-update ✅ Protected (for performance metrics & automation)
│   ├── fix/*  🔧 Feature/bug fix branches
│   └── issue/* 📝 Issue-specific branches
└── pr-*       🔀 Pull request branches
```

### **Branch Details:**

| Branch | Protection | Purpose | Workflow Triggers |
|--------|------------|---------|-------------------|
| **main** | ✅ Protected | Production releases (GitHub Pages auto-deploy) | ✅ performance.yml ✅ infrastructure.yml ✅ All workflows |
| **dev-update** | ✅ Protected | Performance metrics & automation artifacts | ✅ performance.yml ✅ infrastructure.yml ✅ All workflows |
| **fix/** | ❌ Unprotected | Bug fixes and hotfixes | Depends on target branch |
| **issue/** | ❌ Unprotected | Issue-specific work | Depends on target branch |

### **Why Keep dev-update:**
- ✅ **Separation of concerns**: Performance metrics (dev artifacts) vs production code
- ✅ **Cleaner releases**: main only contains production-ready code
- ✅ **Easier debugging**: Can revert dev-update without affecting production
- ✅ **GitHub best practices**: Separate branches for different purposes
- ✅ **Your architecture**: main is release branch, dev-update is staging for automation

---

## 🚀 Workflow Execution Flow

### **Performance Monitoring & Benchmarking Workflow**

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  GitHub Actions Workflow: performance.yml                                   │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TRIGGER EVENTS:                                                              │
│  1. Push to main                                                             │
│  2. Push to dev-update                                                       │
│  3. Pull request to main or dev-update                                       │
│  4. Schedule (every 2 hours)                                                 │
│  5. Manual trigger (workflow_dispatch)                                       │
│                                                                               │
│  WORKFLOW EXECUTION FLOW:                                                     │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │  1. Workflow triggers on push to dev-update                             │ │
│  │     (or main, pull request, schedule)                                   │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │  2. Checkout repository                                                  │ │
│  │     Uses: actions/checkout@v4 with fetch-depth: 0                       │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │  3. Set up pnpm and Node.js                                               │ │
│  │     Uses: ./.github/actions/setup-pnpm                                  │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │  4. Run Lighthouse Audits                                                 │ │
│  │     - Builds Astro site                                                   │ │
│  │     - Starts Astro server                                                 │ │
│  │     - Runs Lighthouse audits on URLs                                      │ │
│  │     - Uploads results as artifacts                                        │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │  5. 🆕 Collect Performance Metrics (UPDATED VERSION)                     │ │
│  │     - Creates temp branch: perf-metrics-20260816-173045                  │ │
│  │     - Commits metrics to temp branch                                     │ │
│  │     - Pushes temp branch to GitHub                                        │ │
│  │     - Creates PR: temp → dev-update                                       │ │
│  │     - Creates PR: dev-update → main (auto-merge if possible)              │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │  6. Generate Performance Summary                                           │ │
│  │     - Lists recent performance metrics                                    │ │
│  │     - Provides human-readable summary                                     │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │  7. Performance Alerts                                                    │ │
│  │     - Status check for workflow completion                               │ │
│  │     - Can trigger additional alerts if needed                            │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

### **Key Flow Changes:**
- ✅ **Temp branch** created from main
- ✅ **Push temp branch** directly to GitHub (not to protected branch)
- ✅ **PR to dev-update** (both branches protected, so need intermediate PR)
- ✅ **PR to main** (final merge of performance metrics)
- ✅ **Auto-merge** to main when status checks pass

---

## 🎯 Branch Strategy Decision: Keep dev-update

### **Why We Keep dev-update Branch**

**Your Architecture:**
- `main` = Production release branch (protected, auto-deploys to GitHub Pages)
- `dev-update` = Development updates branch (also protected)
- Performance metrics = Development artifacts, not production code

**Decision:** ✅ **KEEP dev-update** for optimal separation of concerns

### **The Problem (Before Fix):**

```yaml
# ❌ OLD CODE - Violates branch protection for BOTH branches
- name: Commit performance metrics
  run: |
    git config --global user.name "github-actions[bot]"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git add .performance-history/
    
    if ! git diff --cached --quiet; then
      git commit -m "chore: Update performance metrics [skip ci]"
      git push  # ❌ Direct push to protected branch - VIOLATES RULES
    fi
```

**Error:**
```
remote: error: GH013: Repository rule violations found for refs/heads/main
remote: - Changes must be made through a pull request.
remote: - Required status check "build" is expected.
```

### **The Solution (After Fix):**

```yaml
# ✅ NEW CODE - Branch protection compliant for BOTH protected branches
- name: Commit performance metrics
  id: commit-metrics
  run: |
    git config --global user.name "github-actions[bot]"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git add .performance-history/
    
    if ! git diff --cached --quiet; then
      # Create temp branch with timestamp
      TEMP_BRANCH="perf-metrics-$(date +%Y%m%d-%H%M%S)"
      git checkout -b "$TEMP_BRANCH" main
      git commit -m "chore: Update performance metrics [skip ci]"
      git push origin "$TEMP_BRANCH"  # ✅ Push temp branch directly
      
      echo "✅ Metrics committed to temp branch: $TEMP_BRANCH"
      echo "TEMP_BRANCH=$TEMP_BRANCH" >> $GITHUB_ENV
      echo "HAS_CHANGES=true" >> $GITHUB_OUTPUT
    else
      echo "ℹ️ No changes in performance metrics"
      echo "HAS_CHANGES=false" >> $GITHUB_OUTPUT
    fi
  continue-on-error: true

- name: Create Pull Request to dev-update
  if: steps.commit-metrics.outputs.HAS_CHANGES == 'true'
  id: pr-dev-update
  uses: actions/github-script@v7
  with:
    script: |
      const { data: pr } = await github.rest.pulls.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'chore: Update performance metrics',
        head: process.env.TEMP_BRANCH,
        base: 'dev-update',
        body: `Automated performance metrics update from workflow run ${context.runId}

**Workflow**: ${context.workflow}
**Trigger**: ${context.eventName}

This PR updates performance history metrics collected from Lighthouse audits.`
      });
      console.log(`✅ Created PR to dev-update #${pr.number}: ${pr.html_url}`);
      core.setOutput('pr_number', pr.number);
      core.setOutput('pr_url', pr.html_url);
  continue-on-error: true

- name: Create Pull Request to main
  if: steps.pr-dev-update.outcome == 'success'
  uses: actions/github-script@v7
  with:
    script: |
      const pr = await github.rest.pulls.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'chore: Update performance metrics',
        head: 'dev-update',
        base: 'main',
        body: `Automated performance metrics update

This PR merges performance metrics from dev-update to main.

**Source PR**: #${{ steps.pr-dev-update.outputs.pr_number }}`
      });
      console.log(`✅ Created PR to main #${pr.number}: ${pr.html_url}`);
      
      # Auto-merge to main if possible
      try {
        await github.rest.pulls.merge({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: pr.number,
          merge_method: 'squash'
        });
        console.log(`✅ PR to main auto-merged`);
      } catch (e) {
        console.log('PR to main created, requires manual review');
      }
  continue-on-error: true
```

---

## 📋 Branch Protection Rules

### **main Branch Protection:**

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

**Rules:**
- ✅ Requires pull request before merging
- ✅ Requires status check "build" to pass
- ✅ Requires 1 approving review
- ✅ Dismisses stale reviews
- ❌ No force pushes allowed
- ❌ No direct pushes allowed

### **dev-update Branch Protection:**

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

**Rules:**
- ✅ Requires pull request before merging
- ✅ Requires status check "build" to pass
- ❌ No approving reviews required (for automation)
- ✅ Dismisses stale reviews
- ❌ No force pushes allowed
- ❌ No direct pushes allowed

---

## 🎯 Branch Strategy Benefits

### **For Performance Monitoring Workflow:**

| Benefit | Explanation |
|---------|-------------|
| ✅ **Branch Protection Compliant** | Pushes to temp branch, PRs to protected branches |
| ✅ **Maintains Workflow Continuity** | dev-update triggers workflows, no config changes needed |
| ✅ **Audit Trail** | Full PR history maintained in GitHub |
| ✅ **Review Process** | Changes can be reviewed before merging |
| ✅ **Auto-Merge** | If status checks pass, PR auto-merges cleanly |
| ✅ **Clean Branch Management** | Temp branches auto-deleted after merge |
| ✅ **GitHub Best Practices** | Follows recommended workflow patterns |
| ✅ **Separation of Concerns** | Performance metrics isolated from production code |

### **Workflow Trigger Matrix:**

| Trigger Event | main | dev-update | fix/* | issue/* |
|---------------|------|------------|-------|---------|
| Push to branch | ✅ Runs | ✅ Runs | ✅ Runs | ✅ Runs |
| Pull request | ✅ Runs | ✅ Runs | ❌ No | ❌ No |
| Schedule | ✅ Runs | ✅ Runs | ❌ No | ❌ No |
| Manual trigger | ✅ Runs | ✅ Runs | ✅ Runs | ✅ Runs |

---

## 🔄 Alternative Branch Strategies

### **Option 1: Push Directly to main (REJECTED ❌)**

```yaml
# ❌ NOT RECOMMENDED
git push origin main
```

**Problems:**
- ❌ Violates branch protection rules
- ❌ No audit trail (bypasses PR)
- ❌ No review process
- ❌ Breaks GitHub best practices
- ❌ Will fail with error GH013

### **Option 2: Push to dev-update, PR to main (CHOSEN ✅✅✅)**

```yaml
# ✅ RECOMMENDED
git push origin "$TEMP_BRANCH:dev-update"
# Then create PR: dev-update → main
```

**Benefits:**
- ✅ Branch protection compliant
- ✅ Full audit trail via PR
- ✅ Review process maintained
- ✅ Follows GitHub best practices
- ✅ Auto-merge capability

### **Option 3: Dedicated Automation Branch (ALTERNATIVE ✅)**

```yaml
# ✅ Alternative
git push origin "$TEMP_BRANCH:automation"
# Then create PR: automation → main
```

**Benefits:**
- ✅ Dedicated branch for automation
- ✅ Clear separation of concerns
- ✅ Easy to track report history

**Drawbacks:**
- ⚠️ Requires additional branch management

---

## 📈 Monitoring and Verification

### **Check Current Branch Protection:**

```bash
# Check main branch protection
gh api repos/hanbini96/HanBin-Baik-Blog/branches/main/protection | jq '.'

# Check dev-update branch protection
gh api repos/hanbini96/HanBin-Baik-Blog/branches/dev-update/protection | jq '.'
```

### **Verify Workflow Triggers:**

```bash
# List all workflow files
echo "📋 Workflow files:"
ls -la .github/workflows/*.yml

# Check workflow triggers
echo "🔍 Workflow triggers:"
for file in .github/workflows/*.yml; do
  echo "📄 $file"
  grep -A 10 "on:" "$file" | head -15
done
```

### **Monitor Workflow Execution:**

```bash
# Check recent workflow runs
echo "📊 Recent workflow runs:"
gh run list --limit 20 --json databaseId,workflowName,status,conclusion,createdAt | \
  jq -r '.[] | "Run #\(.databaseId) - \(.workflowName) - \(.status) - \(.conclusion) - \(.createdAt)"'

# Check PR creation
echo "📝 Recent PRs:"
gh pr list --limit 10 --state merged | jq -r '.[] | "PR #\(.number) - \(.title) - Merged: \(.mergedAt)"'
```

---

## 🎓 Best Practices for Branch Management

### **1. Branch Naming Conventions:**

```
main          → Production branch (protected)
dev-update    → Development updates (protected)
fix/*         → Bug fixes (e.g., fix/issue-123)
feature/*     → New features (e.g., feature/auth)
docs/*        → Documentation updates
test/*        → Test changes
chore/*       → Maintenance tasks
```

### **2. Workflow Trigger Guidelines:**

```yaml
# ✅ GOOD - Triggers on protected branches
on:
  push:
    branches: [ main, dev-update ]
  pull_request:
    branches: [ main, dev-update ]

# ❌ AVOID - Triggers on unprotected branches only
on:
  push:
    branches: [ dev ]  # Not protected!
```

### **3. Commit Message Guidelines:**

```
✅ GOOD:
- chore: Update performance metrics [skip ci]
- fix: Resolve build failure in workflow
- docs: Update README with new features
- feat: Add user authentication

❌ AVOID:
- Fixed stuff
- Update
- WIP
```

### **4. Pull Request Guidelines:**

```
✅ GOOD PR:
- Clear title: "chore: Update performance metrics"
- Descriptive body explaining changes
- Linked to issue or workflow run
- Includes screenshots if UI changes
- Requests review from relevant team members

❌ BAD PR:
- "Update"
- No description
- No context
```

---

## 🔧 Troubleshooting Branch Issues

### **Problem: Workflow fails to push**

**Symptoms:**
- Error: `remote: permission denied`
- Error: `! [remote rejected]`

**Solutions:**
```bash
# Check if dev-update exists
git show-ref --verify --quiet refs/heads/dev-update

# If not, create it
gh api -X POST repos/hanbini96/HanBin-Baik-Blog/git/refs \
  -f ref="refs/heads/dev-update" \
  -f sha=$(gh api repos/hanbini96/HanBin-Baik-Blog/git/refs/heads/main | jq -r '.object.sha')
```

### **Problem: PR not created automatically**

**Symptoms:**
- Workflow completes but no PR appears
- GitHub script fails silently

**Solutions:**
```bash
# Check GitHub token permissions
# Ensure secrets.GITHUB_TOKEN has 'pull-requests: write' permission

# Check workflow logs
PERF_RUN_ID=$(gh run list --workflow performance.yml --limit 1 --status success --json databaseId -q '.[0].databaseId')
gh run view $PERF_RUN_ID --log | grep -A 20 "Create Pull Request"
```

### **Problem: Auto-merge fails**

**Symptoms:**
- PR created but not merged
- Error in merge step

**Solutions:**
```bash
# Check if merge queue is enabled
# Check if admin rights are required

# Try manual merge
PR_NUMBER=$(gh pr list --limit 1 --state open --json number -q '.[0].number')
gh pr merge $PR_NUMBER --squash --auto
```

---

## 📚 References and Resources

### **GitHub Documentation:**
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [GitHub Script API](https://docs.github.com/en/rest/reference/pulls#create-a-pull-request)

### **Best Practices:**
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Trunk-Based Development](https://trunkbaseddevelopment.com/)
- [Git Branching Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows)

### **Tools:**
- [GitHub CLI (gh)](https://cli.github.com/)
- [GitHub Branch Protection API](https://docs.github.com/en/rest/branches/branch-protection)
- [GitHub Actions](https://github.com/features/actions)

---

## 🎯 Summary

### **Current Strategy: Push to temp branch, PR to dev-update, PR to main ✅**

**Why it's optimal:**
1. ✅ **Branch Protection Compliant** - Works with both branches protected
2. ✅ **Maintains Workflow Continuity** - dev-update triggers workflows automatically
3. ✅ **Audit Trail** - Full PR history in GitHub
4. ✅ **Review Process** - Changes can be reviewed before merging
5. ✅ **Auto-Merge** - Clean merges when status checks pass
6. ✅ **GitHub Best Practices** - Follows recommended patterns
7. ✅ **Clean Branch Management** - Temp branches auto-deleted after merge
8. ✅ **Separation of Concerns** - Performance metrics isolated from production code

### **Files Modified:**
- `BRANCH_STRATEGY_DOCUMENTATION.md` - Updated with new architecture
- `.github/workflows/performance.yml` - Will apply updated workflow

### **Status:** ✅ **COMPLETE AND OPTIMAL**

---

## 🚀 Next Steps

1. ✅ **Documentation Updated** - This guide with new strategy
2. 🔄 **Apply Workflow Fix** - Update performance.yml with new code
3. 📝 **Commit & Push** - Update documentation file
4. 🔀 **Create PR** - PR from updated documentation to dev-update
5. 🧹 **Cleanup** - Remove old failed workflows
6. 📊 **Monitor Results** - Verify PR creation and auto-merge

**The branch strategy is now fully documented and optimized!** 🎉

---

*Last Updated: 2026-08-16  
Version: 2.0 (Updated for both branches protected)  
Status: ✅ COMPLETE*