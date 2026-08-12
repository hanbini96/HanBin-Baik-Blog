#!/bin/bash

# 🚀 HanBin-Baik-Blog Kanban Quick Start Script
# Simplified setup for team members

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Project info
PROJECT_NAME="Person Blog"
PROJECT_ID="1"
OWNER="hanbini96"
REPO="HanBin-Baik-Blog"

# Check if GitHub CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        echo -e "${YELLOW}⚠️  GitHub CLI (gh) is not installed.${NC}"
        echo "Installing GitHub CLI..."
        
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y gh
        elif command -v pkg &> /dev/null; then
            pkg install -y gh
        else
            echo -e "${YELLOW}Please install GitHub CLI manually from https://cli.github.com${NC}"
            exit 1
        fi
    fi
}

# Check authentication
check_auth() {
    echo -e "${BLUE}🔐 Checking authentication...${NC}"
    
    if ! gh auth status >/dev/null 2>&1; then
        echo "GitHub CLI not authenticated."
        echo "Please run: gh auth login"
        exit 1
    fi
    
    if ! gh auth status | grep -q "read:project"; then
        echo "Missing 'read:project' scope."
        echo "Please run: gh auth refresh -s read:project"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Authenticated successfully!${NC}"
}

# Check project exists
check_project() {
    echo -e "${BLUE}📋 Checking project...${NC}"
    
    if gh project view "$PROJECT_ID" --owner "$OWNER" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Project '$PROJECT_NAME' exists (ID: $PROJECT_ID)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Project not found. Please create it first.${NC}"
        echo "Visit: https://github.com/users/$OWNER/projects/$PROJECT_ID"
        exit 1
    fi
}

# Quick setup
quick_setup() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║      HanBin-Baik-Blog Kanban Quick Setup         ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check everything
    check_gh_cli
    check_auth
    check_project
    
    echo ""
    echo -e "${GREEN}✅ All checks passed! Kanban system is ready to use.${NC}"
    echo ""
    
    echo "📚 Quick Start Guide:"
    echo ""
    echo "1. To add an issue to the project:"
    echo "   $ gh issue create --title 'My issue' --body 'Description'"
    echo "   $ .github/scripts/kanban-automation.sh"
    echo "   Choose option 2, enter the issue number"
    echo ""
    echo "2. To add a PR to the project:"
    echo "   $ gh pr create --title 'My PR' --body 'Changes'"
    echo "   PR will be added automatically!"
    echo ""
    echo "3. To check project status:"
    echo "   $ .github/scripts/kanban-automation.sh"
    echo "   Choose option 8"
    echo ""
    echo "4. To generate weekly report:"
    echo "   $ .github/scripts/kanban-automation.sh"
    echo "   Choose option 6"
    echo ""
    echo "🔗 Project URL: https://github.com/users/$OWNER/projects/$PROJECT_ID"
    echo ""
    
    echo "📖 Full documentation:"
    echo "   - .github/KANBAN_SETUP_GUIDE.md"
    echo "   - .github/KANBAN_AUTOMATION.md"
    echo ""
}

# Main execution
main() {
    quick_setup
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main
fi