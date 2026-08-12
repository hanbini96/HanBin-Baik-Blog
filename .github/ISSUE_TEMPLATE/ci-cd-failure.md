---
name: CI/CD Failure Report
about: Report failures in GitHub Actions workflows
labels: [bug, ci-cd]
---

## Description

Please describe the CI/CD failure that occurred.

## Workflow(s) Affected
- [ ] Supabase DB Migrations
- [ ] Deploy to GitHub Pages  
- [ ] Performance Monitoring & Benchmarking
- [ ] Other: _______________

## Error Details

### Log Output
```
[Paste relevant error logs here]
```

### Root Cause Analysis

## Steps to Reproduce
1. 
2. 
3.

## Expected Behavior

## Actual Behavior

## Impact
- [ ] Production deployment blocked
- [ ] Staging deployment blocked  
- [ ] Performance monitoring disabled
- [ ] Other: _______________

## Priority
- [ ] Critical (blocks deployment)
- [ ] High (affects functionality)
- [ ] Medium (non-critical issues)
- [ ] Low (cosmetic/enhancement)

## Additional Context

## Proposed Solution

### Immediate Fix (PATH Issue):
1. Update performance.yml and infrastructure.yml to source bashrc after pnpm setup
2. Add explicit PATH configuration for pnpm global bin directory
3. Verify pnpm command availability before use

### Long-term Solution:
1. Standardize Node.js version across all workflows (currently 22 in some, 24 in others)
2. Implement consistent pnpm configuration
3. Add PATH validation steps
4. Create workflow health check job

## Acceptance Criteria

- [ ] Performance workflow runs successfully on dev-update branch
- [ ] Infrastructure workflow runs successfully on dev-update branch
- [ ] pnpm command is available in all workflow steps
- [ ] PATH is properly configured for pnpm global binaries
- [ ] All workflows use consistent Node.js version (22 recommended)
- [ ] GitHub Pages deployment workflows stable
- [ ] Performance monitoring data collection working
- [ ] 
- [ ]