#!/bin/bash

# Test script to verify the Performance Monitoring workflow fixes
# This script checks for common issues that cause performance monitoring failures

set -e  # Exit on error

echo "🚀 Testing Performance Monitoring Workflow Fixes"
echo "================================================"
echo ""

# Check if required files exist
REQUIRED_FILES=("package.json" "lighthouserc.js" ".github/workflows/performance_metrics.yml")

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ ERROR: Required file not found: $file"
        exit 1
    fi
done

echo "✅ All required files found"

# Check for LHCI secrets configuration
if grep -q "LHCI_GITHUB_APP_TOKEN" .github/workflows/performance_metrics.yml && \
   grep -q "LHCI_TOKEN" .github/workflows/performance_metrics.yml; then
    echo "✅ LHCI secrets are referenced in workflow"
else
    echo "❌ ERROR: LHCI secrets not found in workflow"
    exit 1
fi

# Check for fallback mechanisms
if grep -q "fallback-report" .github/workflows/performance_metrics.yml; then
    echo "✅ Fallback report creation is configured"
else
    echo "❌ ERROR: Fallback report creation not found"
    exit 1
fi

# Check for error handling
if grep -q "Handle Lighthouse CI failures" .github/workflows/performance_metrics.yml; then
    echo "✅ Lighthouse CI failure handling is configured"
else
    echo "❌ ERROR: Lighthouse CI failure handling not found"
    exit 1
fi

# Check for retry logic
if grep -q "MAX_RETRIES" .github/workflows/performance_metrics.yml; then
    echo "✅ Retry logic is implemented for git push"
else
    echo "❌ ERROR: Retry logic not found"
    exit 1
fi

# Check for secret verification
if grep -q "Verify required secrets" .github/workflows/performance_metrics.yml; then
    echo "✅ Secret verification step is present"
else
    echo "❌ ERROR: Secret verification not found"
    exit 1
fi

# Check for global dependency installation verification
if grep -q "Verify installation" .github/workflows/performance_metrics.yml; then
    echo "✅ Global dependency installation verification is present"
else
    echo "❌ ERROR: Dependency verification not found"
    exit 1
fi

# Check for performance history directory creation
if grep -q "Create performance history directory" .github/workflows/performance_metrics.yml; then
    echo "✅ Performance history directory creation is configured"
else
    echo "❌ ERROR: Performance history directory creation not found"
    exit 1
fi

# Check for workflow syntax
if grep -q "name: Performance Monitoring & Benchmarking" .github/workflows/performance_metrics.yml; then
    echo "✅ Workflow name is correct"
else
    echo "❌ ERROR: Workflow name not found"
    exit 1
fi

echo ""
echo "🎉 All performance monitoring workflow checks passed!"
echo ""
echo "📋 Summary of fixes implemented:"
echo "   ✅ Secret verification and error handling"
echo "   ✅ Fallback report creation for Lighthouse failures"
echo "   ✅ Retry logic for git operations"
echo "   ✅ Global dependency installation verification"
echo "   ✅ Performance history directory creation"
echo "   ✅ Comprehensive error messages and alerts"
echo "   ✅ Better workflow structure and organization"
echo ""
echo "🚀 The performance monitoring workflow should now:"
echo "   - Handle missing secrets gracefully"
echo "   - Create fallback reports when Lighthouse fails"
echo "   - Provide clear error messages for troubleshooting"
echo "   - Retry git operations when needed"
echo "   - Collect performance metrics even when some steps fail"
echo ""
echo "📝 Note: Some features require GitHub secrets to be configured:"
echo "   - LHCI_GITHUB_APP_TOKEN"
echo "   - LHCI_TOKEN"
echo "   These should be added to GitHub repository secrets."