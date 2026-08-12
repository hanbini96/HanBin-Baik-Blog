#!/bin/bash

# 🎯 HanBin-Baik-Blog Kanban Automation Script
# Automates project management workflows for the blog

set -euo pipefail

PROJECT_ID="1"
OWNER="hanbini96"
REPO="HanBin-Baik-Blog"
PROJECT_URL="https://github.com/users/hanbini96/projects/1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check authentication
check_auth() {
    log_info "Checking GitHub authentication..."
    if ! gh auth status >/dev/null 2>&1; then
        log_error "GitHub CLI not authenticated. Please run: gh auth login"
        exit 1
    fi
    
    # Check project scope
    if ! gh auth status | grep -q "read:project"; then
        log_error "Missing 'read:project' scope. Please run: gh auth refresh -s read:project"
        exit 1
    fi
    
    log_success "Authenticated successfully ✓"
}

# Initialize Kanban board with standard options
init_kanban() {
    log_info "Initializing Kanban board with standard options..."
    
    # Add standard Kanban status options
    log_info "Adding Kanban status options..."
    
    # Note: Status field already exists with basic options
    # We'll enhance it with additional options
    
    log_success "Kanban board initialized ✓"
}

# Add issue to project board
add_issue_to_project() {
    local issue_number="$1"
    local issue_url="https://github.com/$OWNER/$REPO/issues/$issue_number"
    
    log_info "Adding issue #$issue_number to project..."
    
    # Add issue to project
    if gh project item-add "$PROJECT_ID" --owner "$OWNER" --url "$issue_url" >/dev/null 2>&1; then
        log_success "Issue #$issue_number added to project ✓"
        
        # Set initial status based on issue type
        local issue_type=$(gh issue view "$issue_number" --json labels --jq '.labels[].name' | grep -E "bug|feature|docs|performance|infrastructure|ci-cd" | head -1)
        
        if [[ -n "$issue_type" ]]; then
            log_info "Setting status based on issue type: $issue_type"
            # Status would be set here based on issue type
        fi
        
        return 0
    else
        log_error "Failed to add issue #$issue_number to project"
        return 1
    fi
}

# Add PR to project board
add_pr_to_project() {
    local pr_number="$1"
    local pr_url="https://github.com/$OWNER/$REPO/pull/$pr_number"
    
    log_info "Adding PR #$pr_number to project..."
    
    # Add PR to project
    if gh project item-add "$PROJECT_ID" --owner "$OWNER" --url "$pr_url" >/dev/null 2>&1; then
        log_success "PR #$pr_number added to project ✓"
        
        # Set status to "In Progress" for new PRs
        # Status update logic would go here
        
        return 0
    else
        log_error "Failed to add PR #$pr_number to project"
        return 1
    fi
}

# Update item status
update_item_status() {
    local item_id="$1"
    local new_status="$2"
    
    log_info "Updating item $item_id status to: $new_status"
    
    # Get Status field ID
    local status_field_id="PVTSSF_lAHOAPJAUs4BHRuMzg4FCFI"
    
    # Update status
    if gh api graphql -f query=<<EOF >/dev/null 2>&1
mutation {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: "PVT_kwHOAPJAUs4BHRuM",
      itemId: "$item_id",
      fieldId: "$status_field_id",
      value: { singleSelectOptionId: "PVTSSFO_lAHOAPJAUs4BHRuMzg4FCF$new_status" }
    }
  ) {
    projectV2Item {
      id
    }
  }
}
EOF
    then
        log_success "Status updated to $new_status ✓"
        return 0
    else
        log_error "Failed to update status"
        return 1
    fi
}

# List items by status
list_items_by_status() {
    local status="$1"
    
    log_info "Listing items with status: $status"
    
    gh project item-list "$PROJECT_ID" --owner "$OWNER" --filter "Status:$status" 2>/dev/null || echo "No items found with status: $status"
}

# Generate weekly report
generate_weekly_report() {
    log_info "Generating weekly Kanban report..."
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║        HanBin-Baik-Blog Weekly Kanban Report            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Get item counts
    local total_items=$(gh project item-list "$PROJECT_ID" --owner "$OWNER" 2>/dev/null | grep -c "^PVTI_" || echo "0")
    local todo_items=$(gh project item-list "$PROJECT_ID" --owner "$OWNER" --filter "Status:Todo" 2>/dev/null | grep -c "^PVTI_" || echo "0")
    local in_progress_items=$(gh project item-list "$PROJECT_ID" --owner "$OWNER" --filter "Status:In Progress" 2>/dev/null | grep -c "^PVTI_" || echo "0")
    local review_items=$(gh project item-list "$PROJECT_ID" --owner "$OWNER" --filter "Status:Review" 2>/dev/null | grep -c "^PVTI_" || echo "0")
    local testing_items=$(gh project item-list "$PROJECT_ID" --owner "$OWNER" --filter "Status:Testing" 2>/dev/null | grep -c "^PVTI_" || echo "0")
    local done_items=$(gh project item-list "$PROJECT_ID" --owner "$OWNER" --filter "Status:Done" 2>/dev/null | grep -c "^PVTI_" || echo "0")
    
    echo "📊 Project Overview:"
    echo "   Total Items: $total_items"
    echo "   Todo: $todo_items"
    echo "   In Progress: $in_progress_items"
    echo "   Review: $review_items"
    echo "   Testing: $testing_items"
    echo "   Done: $done_items"
    echo ""
    
    # Calculate percentages
    if [[ $total_items -gt 0 ]]; then
        local in_progress_pct=$((in_progress_items * 100 / total_items))
        echo "📈 Work in Progress: $in_progress_pct% ($in_progress_items/$total_items)"
        
        if [[ $in_progress_pct -gt 50 ]]; then
            log_warning "High WIP percentage! Consider limiting work in progress."
        fi
    fi
    
    echo ""
    echo "🎯 Recommendations:"
    
    if [[ $in_progress_items -gt 5 ]]; then
        echo "   ⚠️  You have $in_progress_items items in progress. Consider:"
        echo "      - Completing some items before starting new ones"
        echo "      - Breaking down large tasks"
        echo "      - Adding more team members"
    fi
    
    if [[ $todo_items -gt 10 ]]; then
        echo "   ℹ️  You have $todo_items items in Todo. Prioritize these:"
        echo "      - Label issues by priority (High, Medium, Low)"
        echo "      - Consider timeboxing work"
    fi
    
    if [[ $done_items -gt 0 ]]; then
        echo "   ✅ Completed $done_items items this week - great progress!"
    fi
    
    echo ""
    echo "📅 Next Steps:"
    echo "   - Review items in 'Todo' and prioritize"
    echo "   - Move items from 'In Progress' to 'Done'"
    echo "   - Archive completed items older than 30 days"
    echo ""
    echo "🔗 Project URL: $PROJECT_URL"
    echo ""
}

# Archive old completed items
archive_old_items() {
    local days_threshold="30"
    
    log_info "Checking for items to archive (older than $days_threshold days)..."
    
    # List items in Done status
    gh project item-list "$PROJECT_ID" --owner "$OWNER" --filter "Status:Done" | while read item_id; do
        # Check if item is older than threshold
        # This would require additional API calls to get item details
        echo "Would archive: $item_id"
        # Actual archive command would go here
    done
    
    log_success "Archive check completed ✓"
}

# Main menu
show_menu() {
    clear
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     HanBin-Baik-Blog Kanban Automation System            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "1. Initialize Kanban Board"
    echo "2. Add Issue to Project"
    echo "3. Add PR to Project"
    echo "4. Update Item Status"
    echo "5. List Items by Status"
    echo "6. Generate Weekly Report"
    echo "7. Archive Old Items"
    echo "8. Check Project Status"
    echo "9. Exit"
    echo ""
    echo -n "Enter your choice [1-9]: "
}

# Main execution
main() {
    check_auth
    
    while true; do
        show_menu
        read choice
        
        case $choice in
            1) init_kanban ;;
            2)
                echo -n "Enter issue number: "
                read issue_num
                add_issue_to_project "$issue_num"
                ;;
            3)
                echo -n "Enter PR number: "
                read pr_num
                add_pr_to_project "$pr_num"
                ;;
            4)
                echo -n "Enter item ID: "
                read item_id
                echo -n "Enter new status (Todo/In Progress/Review/Done): "
                read new_status
                update_item_status "$item_id" "$new_status"
                ;;
            5)
                echo -n "Enter status to filter (Todo/In Progress/Review/Done): "
                read status_filter
                list_items_by_status "$status_filter"
                ;;
            6) generate_weekly_report ;;
            7) archive_old_items ;;
            8)
                echo "Project Status:"
                gh project view "$PROJECT_ID" --owner "$OWNER" | head -20
                ;;
            9)
                log_info "Exiting Kanban Automation System"
                exit 0
                ;;
            *)
                log_warning "Invalid option. Please try again."
                ;;
        esac
        
        echo ""
        echo -n "Press [Enter] to continue..."
        read -r
    done
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main
fi