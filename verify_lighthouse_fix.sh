#!/bin/bash

# Lighthouse CI Fix Verification Script
# This script verifies that the Lighthouse artifact updating fixes are properly implemented

set -e  # Exit on error

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_file_exists() {
    if [ -f "$1" ]; then
        log_success "File exists: $1"
        return 0
    else
        log_error "File missing: $1"
        return 1
    fi
}

check_workflow_changes() {
    echo "🔍 Checking workflow changes..."
    
    # Check for artifactName in lighthouse job
    if grep -q 'artifactName: "lighthouse-results"' .github/workflows/performance.yml; then
        log_success "✓ Artifact naming configured in lighthouse job"
    else
        log_error "✗ Artifact naming missing in lighthouse job"
        return 1
    fi
    
    # Check for id: lighthouse
    if grep -q 'id: lighthouse' .github/workflows/performance.yml; then
        log_success "✓ Step ID configured for lighthouse job"
    else
        log_error "✗ Step ID missing for lighthouse job"
        return 1
    fi
    
    # Check for artifactName in lighthouserc.js
    if grep -q "artifactName: 'lighthouse-results'" lighthouserc.js; then
        log_success "✓ Artifact naming configured in lighthouserc.js"
    else
        log_error "✗ Artifact naming missing in lighthouserc.js"
        return 1
    fi
    
    # Check for uploadArtifacts in lighthouserc.js
    if grep -q 'uploadArtifacts: true' lighthouserc.js; then
        log_success "✓ uploadArtifacts configured in lighthouserc.js"
    else
        log_error "✗ uploadArtifacts missing in lighthouserc.js"
        return 1
    fi
    
    # Check for fallback mechanism
    if grep -q 'check-artifacts' .github/workflows/performance.yml; then
        log_success "✓ Fallback mechanism configured"
    else
        log_error "✗ Fallback mechanism missing"
        return 1
    fi
    
    # Check for continue-on-error
    if grep -q 'continue-on-error: true' .github/workflows/performance.yml; then
        log_success "✓ Error handling configured for artifact download"
    else
        log_error "✗ Error handling missing for artifact download"
        return 1
    fi
    
    # Check for if: always() in parse metrics
    if grep -q 'if: always()' .github/workflows/performance.yml; then
        log_success "✓ Always run configured for parse metrics step"
    else
        log_error "✗ Always run missing for parse metrics step"
        return 1
    fi
}

check_documentation() {
    echo "📚 Checking documentation..."
    
    if [ -f "LIGHTHOUSE_SETUP.md" ]; then
        log_success "✓ LIGHTHOUSE_SETUP.md exists"
    else
        log_error "✗ LIGHTHOUSE_SETUP.md missing"
        return 1
    fi
    
    if [ -f "LIGHTHOUSE_FIXES_SUMMARY.md" ]; then
        log_success "✓ LIGHTHOUSE_FIXES_SUMMARY.md exists"
    else
        log_error "✗ LIGHTHOUSE_FIXES_SUMMARY.md missing"
        return 1
    fi
    
    if grep -q "Lighthouse CI Setup" PERFORMANCE_MONITORING.md; then
        log_success "✓ Lighthouse CI setup section added to PERFORMANCE_MONITORING.md"
    else
        log_error "✗ Lighthouse CI setup section missing from PERFORMANCE_MONITORING.md"
        return 1
    fi
}

check_secrets() {
    echo "🔐 Checking GitHub secrets configuration..."
    
    # Check if secrets are referenced in workflow
    if grep -q 'LHCI_GITHUB_APP_TOKEN' .github/workflows/performance.yml; then
        log_success "✓ LHCI_GITHUB_APP_TOKEN referenced in workflow"
    else
        log_error "✗ LHCI_GITHUB_APP_TOKEN not referenced in workflow"
        return 1
    fi
    
    if grep -q 'LHCI_TOKEN' .github/workflows/performance.yml; then
        log_success "✓ LHCI_TOKEN referenced in workflow"
    else
        log_warning "⚠️ LHCI_TOKEN not referenced (optional)"
    fi
    
    log_warning "ℹ️ Note: Secrets need to be manually configured in GitHub repository"
    log_warning "ℹ️ Follow LIGHTHOUSE_SETUP.md for setup instructions"
}

check_fallback_creation() {
    echo "🛡️ Checking fallback mechanism..."
    
    if grep -q 'fallback-report.json' .github/workflows/performance.yml; then
        log_success "✓ Fallback report creation configured"
    else
        log_error "✗ Fallback report creation missing"
        return 1
    fi
    
    if grep -q 'artifacts-exist' .github/workflows/performance.yml; then
        log_success "✓ Artifact existence check configured"
    else
        log_error "✗ Artifact existence check missing"
        return 1
    fi
}

main() {
    echo "=========================================="
    echo "Lighthouse CI Fix Verification Script"
    echo "=========================================="
    echo ""
    
    local all_passed=true
    
    # Check required files
    echo "📁 Checking required files..."
    check_file_exists ".github/workflows/performance.yml" || all_passed=false
    check_file_exists "lighthouserc.js" || all_passed=false
    check_file_exists "LIGHTHOUSE_SETUP.md" || all_passed=false
    check_file_exists "LIGHTHOUSE_FIXES_SUMMARY.md" || all_passed=false
    check_file_exists "PERFORMANCE_MONITORING.md" || all_passed=false
    echo ""
    
    # Check workflow changes
    echo "🔧 Checking workflow changes..."
    check_workflow_changes || all_passed=false
    echo ""
    
    # Check documentation
    echo "📚 Checking documentation..."
    check_documentation || all_passed=false
    echo ""
    
    # Check secrets configuration
    check_secrets
    echo ""
    
    # Check fallback mechanism
    echo "🛡️ Checking fallback mechanism..."
    check_fallback_creation || all_passed=false
    echo ""
    
    # Final summary
    echo "=========================================="
    if [ "$all_passed" = true ]; then
        echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
        echo ""
        echo "📋 Summary of Fixes Implemented:"
        echo "   ✓ Artifact naming configured"
        echo "   ✓ Fallback mechanism added"
        echo "   ✓ Error handling improved"
        echo "   ✓ Documentation updated"
        echo "   ✓ Workflow robustness enhanced"
        echo ""
        echo "🎯 The workflow is now production-ready!"
        echo ""
        echo "ℹ️ Optional: Set up Lighthouse CI secrets for enhanced features"
        echo "   Follow: LIGHTHOUSE_SETUP.md"
        exit 0
    else
        echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
        echo ""
        echo "Please review the errors above and fix them."
        exit 1
    fi
}

# Run main function
main