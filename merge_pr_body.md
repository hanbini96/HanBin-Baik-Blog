## Description

This PR merges the performance monitoring workflow fixes from dev-update to main branch to ensure production deployment has the latest fixes.

## Changes Merged

### Performance Monitoring Fixes (#44)
- ✅ Fixed artifact upload configuration in `performance_metrics.yml`
- ✅ Added missing secrets to environment variables (LHCI_GITHUB_APP_TOKEN, LHCI_TOKEN)
- ✅ Improved error handling and alerting in performance alerts job
- ✅ Enhanced fallback mechanisms for missing artifacts
- ✅ Added `checks:write` permission for better GitHub integration
- ✅ Updated artifact naming and retention policies

### Related Issues
- Fixes #43 - Performance monitoring workflow failures on dev-update
- Related to #34 - CI/CD failures summary
- Resolves performance monitoring blocking issues

## Testing Required

1. **Verify PR merges cleanly** - No conflicts or issues
2. **Check workflow runs on main branch** - Ensure performance_metrics.yml works in production
3. **Monitor deployment status** - Verify GitHub Pages deployment succeeds
4. **Validate performance metrics collection** - Check that metrics are collected post-merge

## Success Criteria
- ✅ PR merges without conflicts
- ✅ Workflow runs complete successfully on main branch
- ✅ Performance metrics collected and stored
- ✅ No breaking changes to production deployment
- ✅ GitHub Pages deployment succeeds

## Deployment Impact

**Expected**: No breaking changes - these are bug fixes for workflow failures
**Risk Level**: Low (workflow configuration improvements only)
**Rollback Plan**: Revert to previous main branch if issues occur

## Monitoring Commands

```bash
# Check workflow runs after merge
gh run list --branch main --workflow performance_metrics.yml --limit 5

# Monitor deployment status
gh run list --branch main --workflow github_pages.yml --limit 3

# Check performance metrics collection
gh run list --branch main --workflow performance_metrics.yml --limit 3
```

## Next Steps

1. **Review this PR** - Check the changes being merged
2. **Merge when approved** - This will deploy fixes to production
3. **Monitor workflow runs** - Verify success on main branch
4. **Celebrate!** - Performance monitoring will now work in production

---

**Priority**: Medium (production deployment of fixes)
**Type**: Merge from dev-update to main
**Related**: PR #44, Issue #43, Issue #34