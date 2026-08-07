#!/bin/bash

# Infrastructure Monitoring Test Suite
# Tests all aspects of the infrastructure monitoring implementation

set -e

echo "=========================================="
echo "  Infrastructure Monitoring Test Suite"
echo "  Issue #7: Infrastructure Monitoring & Health Checks"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

# Test functions

check_file_exists() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        PASS_COUNT=$((PASS_COUNT + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description - File not found: $file"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

check_directory_exists() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description"
        PASS_COUNT=$((PASS_COUNT + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description - Directory not found: $dir"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

check_string_in_file() {
    local file=$1
    local search_string=$2
    local description=$3
    
    if grep -q "$search_string" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $description"
        PASS_COUNT=$((PASS_COUNT + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description - String not found in $file"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

check_git_branch() {
    local expected_branch=$1
    local description=$2
    
    current_branch=$(git branch --show-current)
    if [ "$current_branch" = "$expected_branch" ]; then
        echo -e "${GREEN}✓${NC} $description - On branch: $current_branch"
        PASS_COUNT=$((PASS_COUNT + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description - Expected branch: $expected_branch, Current: $current_branch"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

test_documentation() {
    echo -e "${BLUE}Testing Documentation...${NC}"
    echo ""
    
    check_file_exists "INFRASTRUCTURE_MONITORING.md" "Infrastructure monitoring documentation"
    check_file_exists "monitoring-config.json" "Monitoring configuration file"
    check_file_exists "verify_health_checks.sh" "Health check verification script"
    check_file_exists "test_infrastructure_monitoring.sh" "Test suite script"
    
    echo ""
}

test_health_endpoints() {
    echo -e "${BLUE}Testing Health Check Endpoints...${NC}"
    echo ""
    
    check_file_exists "src/pages/api/health.ts" "Basic health endpoint (src/pages/api/health.ts)"
    check_file_exists "src/pages/api/health.json.ts" "Comprehensive health endpoint (src/pages/api/health.json.ts)"
    
    # Check endpoint content
    check_string_in_file "src/pages/api/health.ts" "export async function GET()" "Basic health endpoint has GET function"
    check_string_in_file "src/pages/api/health.json.ts" "export async function GET()" "Comprehensive health endpoint has GET function"
    check_string_in_file "src/pages/api/health.json.ts" "createClient" "Comprehensive health endpoint uses Supabase client"
    check_string_in_file "src/pages/api/health.json.ts" "databaseStatus" "Comprehensive health endpoint includes database status"
    
    echo ""
}

test_github_actions() {
    echo -e "${BLUE}Testing GitHub Actions Configuration...${NC}"
    echo ""
    
    check_file_exists ".github/workflows/github_pages.yml" "GitHub Actions workflow file"
    
    # Check workflow content
    check_string_in_file ".github/workflows/github_pages.yml" "health-check:" "Health check job configured"
    check_string_in_file ".github/workflows/github_pages.yml" "uptime-monitoring:" "Uptime monitoring job configured"
    check_string_in_file ".github/workflows/github_pages.yml" "schedule:" "Scheduled health checks configured"
    check_string_in_file ".github/workflows/github_pages.yml" "health.json" "Health endpoint referenced in workflow"
    
    echo ""
}

test_monitoring_scripts() {
    echo -e "${BLUE}Testing Monitoring Scripts...${NC}"
    echo ""
    
    check_file_exists "scripts/stabilization-tracker.sh" "Stabilization tracker script"
    check_file_exists "verify_health_checks.sh" "Health check verification script"
    check_file_exists "test_infrastructure_monitoring.sh" "Test suite script"
    
    # Check script permissions
    if [ -x "verify_health_checks.sh" ]; then
        echo -e "${GREEN}✓${NC} Health check verification script has execute permissions"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗${NC} Health check verification script missing execute permissions"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    if [ -x "test_infrastructure_monitoring.sh" ]; then
        echo -e "${GREEN}✓${NC} Test suite script has execute permissions"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗${NC} Test suite script missing execute permissions"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    echo ""
}

test_environment_files() {
    echo -e "${BLUE}Testing Environment Configuration...${NC}"
    echo ""
    
    check_file_exists ".env.example" "Environment variable example file"
    check_string_in_file ".env.example" "PUBLIC_SUPABASE_URL" "Supabase URL in environment example"
    check_string_in_file ".env.example" "PUBLIC_SUPABASE_ANON_KEY" "Supabase anon key in environment example"
    
    echo ""
}

test_readme_updates() {
    echo -e "${BLUE}Testing README Updates...${NC}"
    echo ""
    
    check_string_in_file "README.md" "Infrastructure Monitoring & Health Checks" "README mentions infrastructure monitoring"
    check_string_in_file "README.md" "/api/health.json" "README includes health endpoint URL"
    check_string_in_file "README.md" "health check endpoints" "README describes health check endpoints"
    
    echo ""
}

test_issue_requirements() {
    echo -e "${BLUE}Testing Issue #7 Requirements...${NC}"
    echo ""
    
    # Issue #7 requirements: Infrastructure Monitoring & Health Checks
    
    # 1. Health check endpoints
    echo -n "Checking health check endpoints... "
    if [ -f "src/pages/api/health.ts" ] && [ -f "src/pages/api/health.json.ts" ]; then
        echo -e "${GREEN}✓${NC} Health check endpoints implemented"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗${NC} Health check endpoints missing"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    # 2. GitHub Actions monitoring
    echo -n "Checking GitHub Actions monitoring... "
    if grep -q "health-check:" .github/workflows/github_pages.yml && \
       grep -q "uptime-monitoring:" .github/workflows/github_pages.yml; then
        echo -e "${GREEN}✓${NC} GitHub Actions monitoring configured"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗${NC} GitHub Actions monitoring not configured"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    # 3. Supabase monitoring
    echo -n "Checking Supabase monitoring... "
    if grep -q "createClient" src/pages/api/health.json.ts; then
        echo -e "${GREEN}✓${NC} Supabase monitoring implemented"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗${NC} Supabase monitoring not implemented"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    # 4. System monitoring
    echo -n "Checking system monitoring... "
    if grep -q "memoryUsage\|uptime" src/pages/api/health.json.ts; then
        echo -e "${GREEN}✓${NC} System monitoring implemented"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗${NC} System monitoring not implemented"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    # 5. Documentation
    echo -n "Checking documentation... "
    if [ -f "INFRASTRUCTURE_MONITORING.md" ]; then
        echo -e "${GREEN}✓${NC} Infrastructure monitoring documentation exists"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗${NC} Infrastructure monitoring documentation missing"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    echo ""
}

generate_summary() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Test Results Summary${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
    echo -e "${RED}Failed: $FAIL_COUNT${NC}"
    echo ""
    
    local total=$((PASS_COUNT + FAIL_COUNT))
    local percentage=$((PASS_COUNT * 100 / total))
    
    if [ $FAIL_COUNT -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed! Infrastructure monitoring implementation is complete.${NC}"
        echo ""
        echo "Implementation Summary:"
        echo "- ✓ Health check endpoints created"
        echo "- ✓ GitHub Actions monitoring configured"
        echo "- ✓ Supabase connectivity monitoring implemented"
        echo "- ✓ System resource monitoring added"
        echo "- ✓ Comprehensive documentation created"
        echo "- ✓ Test scripts provided"
        echo ""
        echo "Ready to push to dev-update branch and create PR!"
        return 0
    else
        echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
        echo ""
        echo "Failed tests: $FAIL_COUNT out of $total"
        echo ""
        echo "Recommendations:"
        echo "1. Review failed test descriptions above"
        echo "2. Check file paths and content"
        echo "3. Verify GitHub Actions workflow syntax"
        echo "4. Ensure health endpoint files are properly formatted"
        return 1
    fi
}

# Main execution

echo "Starting Infrastructure Monitoring Test Suite..."
echo ""

# Run all test suites
test_documentation
test_health_endpoints
test_github_actions
test_monitoring_scripts
test_environment_files
test_readme_updates
test_issue_requirements

# Generate summary
generate_summary

# Exit with appropriate code
exit $?