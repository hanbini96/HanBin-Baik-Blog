# Lighthouse CI Setup Guide

This guide explains how to set up Lighthouse CI for performance monitoring in this repository.

## Required Setup

### 1. Create Lighthouse CI GitHub App

To use Lighthouse CI with GitHub, you need to create a GitHub App:

1. Go to [GitHub App Settings](https://github.com/settings/apps)
2. Click "New GitHub App"
3. Fill in the details:
   - **GitHub App name**: `Lighthouse CI Monitor` (or any name you prefer)
   - **Homepage URL**: `https://github.com/hanbini96/HanBin-Baik-Blog`
   - **Callback URL**: Leave empty for now
   - **Webhook URL**: Leave empty
   - **Permissions**:
     - **Repository permissions**:
       - `Checks: Read & write`
       - `Contents: Read & write`
       - `Pull requests: Read & write`
       - `Issues: Read & write`
     - **Account permissions**: None needed
   - **Subscribe to events**:
     - `Check run`
     - `Check suite`
     - `Pull request`
     - `Push`

4. Click "Create GitHub App"

### 2. Generate Private Key

After creating the app:
1. Go to your app's settings
2. Click "Generate a private key" in the "Private keys" section
3. Save the `.pem` file securely

### 3. Install GitHub App

1. Go to your app's settings
2. Click "Install App"
3. Choose the repository: `hanbini96/HanBin-Baik-Blog`
4. Install the app

### 4. Add App Token to GitHub Secrets

After installation:
1. Go to your GitHub repository: `https://github.com/hanbini96/HanBin-Baik-Blog/settings/secrets/actions`
2. Click "New repository secret"
3. Add these secrets:
   - **Name**: `LHCI_GITHUB_APP_TOKEN`
     - **Value**: The token shown after app installation (or generate a new one)
   
### 5. (Optional) Create LHCI Token

For more advanced usage, you can create an LHCI token:

1. Install LHCI CLI: `npm install -g @lhci/cli`
2. Run: `lhci wizard`
3. Follow the prompts to create a project token
4. Add to GitHub secrets:
   - **Name**: `LHCI_TOKEN`
   - **Value**: The token generated

## Quick Setup Commands

```bash
# Install LHCI CLI globally
npm install -g @lhci/cli

# Run setup wizard (interactive)
lhci wizard

# Or create tokens manually and add to GitHub secrets
```

## Verification

After setting up the secrets:
1. Push a change to trigger the workflow
2. Check the "Performance Monitoring & Benchmarking" workflow run
3. Verify that Lighthouse CI runs successfully and uploads artifacts

## Troubleshooting

- **403 errors**: Ensure the GitHub App has proper permissions
- **Token issues**: Regenerate tokens if they expire
- **Artifact not found**: Check that `uploadArtifacts: true` is set in lighthouserc.js

## References

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [treosh/lighthouse-ci-action](https://github.com/treosh/lighthouse-ci-action)
- [GitHub App Setup Guide](https://docs.github.com/en/developers/apps/building-github-apps)

---

**Note**: The workflow has fallback mechanisms if Lighthouse artifacts are not available, but proper setup ensures the best results.

Last updated: August 2025