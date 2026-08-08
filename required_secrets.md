# Required Secrets for Performance Monitoring

## Missing Secrets Identified

The `performance_metrics.yml` workflow references these secrets that are currently missing:

### 1. LHCI_GITHUB_APP_TOKEN
- **Purpose**: GitHub App token for Lighthouse CI integration
- **Required**: Yes (for GitHub integration and reporting)
- **Setup**: Create GitHub App and get installation token

### 2. LHCI_TOKEN  
- **Purpose**: Lighthouse CI project token
- **Required**: Optional but recommended (for enhanced reporting)
- **Setup**: Get from Lighthouse CI dashboard

## Quick Setup Instructions

### Option A: Minimal Setup (No Lighthouse Account)
The workflow has fallback mechanisms, so you can start using it immediately without these secrets.

### Option B: Full Setup (Recommended for Enhanced Features)

#### Step 1: Create GitHub App
```bash
# Go to: https://github.com/settings/apps
# Click "New GitHub App"
# Set these permissions:
# - Checks: Read & Write
# - Contents: Read
# - Pull requests: Read & Write  
# - Issues: Read & Write

# After creating app, get the installation token:
# Installation ID: Available in app settings
# Private Key: Download from app settings
```

#### Step 2: Add Secrets via GitHub CLI
```bash
# Add LHCI_GITHUB_APP_TOKEN
# Format: gh secret set LHCI_GITHUB_APP_TOKEN --body "your_github_app_installation_token"

# Add LHCI_TOKEN (optional)
# Format: gh secret set LHCI_TOKEN --body "your_lhci_project_token"
```

#### Step 3: Verify Setup
```bash
# Push a small change to trigger workflow
# Check Actions tab for successful completion
# Verify artifacts are generated
```

## Fallback Behavior

If secrets are not configured:
- ✅ Workflow will still run
- ✅ Fallback metrics will be collected
- ✅ Performance history will be updated
- ❌ No enhanced Lighthouse CI reports

## Documentation References

- **LIGHTHOUSE_SETUP.md** - Detailed GitHub App setup guide
- **PERFORMANCE_MONITORING.md** - Complete monitoring architecture
- **Issue #43** - This performance monitoring issue tracker

## Next Steps

1. 🔧 Decide on setup approach (minimal vs full)
2. 📝 Add required secrets via GitHub CLI or UI
3. 🧪 Test workflow with a small change
4. 📊 Verify performance metrics collection