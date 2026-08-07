#!/bin/bash

# Health Check Verification Script for HanBin-Baik-Blog
# This script verifies that infrastructure monitoring and health checks are working correctly

set -e

echo "=========================================="
echo "  Health Check Verification Script"
echo "  HanBin-Baik-Blog Infrastructure Monitoring"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
HEALTH_ENDPOINT="http://localhost:4321/api/health.json"
BASIC_HEALTH_ENDPOINT="http://localhost:4321/api/health"
TIMEOUT=10
MAX_RETRIES=3

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed.${NC}"
    echo "Please install curl and try again."
    exit 1
fi

# Check if we're in the project directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}Error: Not in project root directory.${NC}"
    exit 1
fi

# Function to make HTTP requests with retry logic
make_request() {
    local url=$1
    local retries=0
    local response_code
    local response_body
    
    while [ $retries -lt $MAX_RETRIES ]; do
        response=$(curl -s -o /tmp/health_response.json -w "%{http_code}" --max-time $TIMEOUT "$url")
        response_code=${response: -3}
        response_body=$(cat /tmp/health_response.json)
        
        if [ "$response_code" = "200" ] || [ "$response_code" = "503" ]; then
            echo "$response_code"
            echo "$response_body"
            return 0
        fi
        
        retries=$((retries + 1))
        echo -e "${YELLOW}Attempt $retries failed, retrying in 2 seconds...${NC}"
        sleep 2
    done
    
    echo "$response_code"
    echo "$response_body"
    return 1
}

# Function to test basic health endpoint
test_basic_health() {
    echo -e "${BLUE}Testing Basic Health Endpoint...${NC}"
    echo "URL: $BASIC_HEALTH_ENDPOINT"
    echo ""
    
    response=$(make_request "$BASIC_HEALTH_ENDPOINT")
    status_code=$(echo "$response" | head -1)
    body=$(echo "$response" | tail -n +2)
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✓ Basic Health Endpoint Working${NC}"
        echo "Response:"
        echo "$body" | jq .
        echo ""
        return 0
    else
        echo -e "${RED}✗ Basic Health Endpoint Failed${NC}"
        echo "Status Code: $status_code"
        echo "Response:"
        echo "$body"
        echo ""
        return 1
    fi
}

# Function to test comprehensive health endpoint
test_comprehensive_health() {
    echo -e "${BLUE}Testing Comprehensive Health Endpoint...${NC}"
    echo "URL: $HEALTH_ENDPOINT"
    echo ""
    
    response=$(make_request "$HEALTH_ENDPOINT")
    status_code=$(echo "$response" | head -1)
    body=$(echo "$response" | tail -n +2)
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "503" ]; then
        echo -e "${GREEN}✓ Comprehensive Health Endpoint Working${NC}"
        echo "Status: $status_code"
        echo "Response:"
        echo "$body" | jq .
        echo ""
        
        # Validate response structure
        if echo "$body" | jq -e '.status' > /dev/null 2>&1; then
            status=$(echo "$body" | jq -r '.status')
            if [ "$status" = "healthy" ] || [ "$status" = "unhealthy" ]; then
                echo -e "${GREEN}✓ Response structure valid${NC}"
            else
                echo -e "${RED}✗ Invalid status in response${NC}"
                return 1
            fi
        fi
        
        return 0
    else
        echo -e "${RED}✗ Comprehensive Health Endpoint Failed${NC}"
        echo "Status Code: $status_code"
        echo "Response:"
        echo "$body"
        echo ""
        return 1
    fi
}

# Function to test health endpoint with different methods
test_health_methods() {
    echo -e "${BLUE}Testing Different HTTP Methods...${NC}"
    echo ""
    
    local methods=("GET" "HEAD" "POST")
    local success_count=0
    
    for method in "${methods[@]};"; do
        echo "Testing $method method..."
        
        case $method in
            "GET")
                response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$HEALTH_ENDPOINT")
                ;;
            "HEAD")
                response=$(curl -s -I -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$HEALTH_ENDPOINT")
                ;;
            "POST")
                response=$(curl -s -X POST -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$HEALTH_ENDPOINT")
                ;;
        esac
        
        if [ "$response" = "200" ] || [ "$response" = "503" ]; then
            echo -e "${GREEN}✓ $method method working (Status: $response)${NC}"
            success_count=$((success_count + 1))
        else
            echo -e "${RED}✗ $method method failed (Status: $response)${NC}"
        fi
        echo ""
    done
    
    if [ $success_count -eq ${#methods[@]} ]; then
        return 0
    else
        return 1
    fi
}

# Function to verify monitoring configuration
test_monitoring_config() {
    echo -e "${BLUE}Verifying Monitoring Configuration...${NC}"
    echo ""
    
    # Check if health check files exist
    if [ -f "src/pages/api/health.ts" ]; then
        echo -e "${GREEN}✓ Basic health endpoint file exists${NC}"
    else
        echo -e "${RED}✗ Basic health endpoint file missing${NC}"
        return 1
    fi
    
    if [ -f "src/pages/api/health.json.ts" ]; then
        echo -e "${GREEN}✓ Comprehensive health endpoint file exists${NC}"
    else
        echo -e "${RED}✗ Comprehensive health endpoint file missing${NC}"
        return 1
    fi
    
    # Check GitHub Actions workflow
    if [ -f ".github/workflows/github_pages.yml" ]; then
        echo -e "${GREEN}✓ GitHub Actions workflow exists${NC}"
        
        # Check if health check job is configured
        if grep -q "health-check:" .github/workflows/github_pages.yml; then
            echo -e "${GREEN}✓ Health check job configured in workflow${NC}"
        else
            echo -e "${YELLOW}⚠ Health check job not found in workflow${NC}"
        fi
        
        # Check if uptime monitoring is configured
        if grep -q "uptime-monitoring:" .github/workflows/github_pages.yml; then
            echo -e "${GREEN}✓ Uptime monitoring job configured in workflow${NC}"
        else
            echo -e "${YELLOW}⚠ Uptime monitoring job not found in workflow${NC}"
        fi
    else
        echo -e "${RED}✗ GitHub Actions workflow missing${NC}"
        return 1
    fi
    
    # Check monitoring documentation
    if [ -f "INFRASTRUCTURE_MONITORING.md" ]; then
        echo -e "${GREEN}✓ Infrastructure monitoring documentation exists${NC}"
    else
        echo -e "${YELLOW}⚠ Infrastructure monitoring documentation missing${NC}"
    fi
    
    if [ -f "monitoring-config.json" ]; then
        echo -e "${GREEN}✓ Monitoring configuration file exists${NC}"
    else
        echo -e "${YELLOW}⚠ Monitoring configuration file missing${NC}"
    fi
    
    echo ""
    return 0
}

# Function to display summary
display_summary() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Verification Summary${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    if [ $all_tests_passed -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed! Infrastructure monitoring is working correctly.${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Deploy to production"
        echo "2. Set up external monitoring (UptimeRobot, etc.)"
        echo "3. Configure alerts"
        echo "4. Monitor health check endpoints"
    else
        echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
        echo ""
        echo "Troubleshooting:"
        echo "1. Make sure the development server is running: pnpm run dev"
        echo "2. Check that Supabase credentials are configured in .env"
        echo "3. Verify network connectivity"
        echo "4. Check file permissions"
    fi
    
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "- INFRASTRUCTURE_MONITORING.md - Complete setup guide"
    echo "- monitoring-config.json - Monitoring configuration"
    echo "- .github/workflows/github_pages.yml - GitHub Actions workflow"
    echo ""
}

# Main execution
all_tests_passed=0

# Start development server if not running
echo -e "${BLUE}Starting development server (if not running)...${NC}"
pnpm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 10

# Run tests
echo -e "${BLUE}Running Health Check Verification Tests...${NC}"
echo ""

test_basic_health || all_tests_passed=1
test_comprehensive_health || all_tests_passed=1
test_health_methods || all_tests_passed=1
test_monitoring_config || all_tests_passed=1

# Kill server
kill $SERVER_PID 2>/dev/null || true

# Display summary
display_summary

# Exit with appropriate code
exit $all_tests_passed