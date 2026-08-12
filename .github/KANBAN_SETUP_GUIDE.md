# 🎯 HanBin-Baik-Blog Kanban Setup Guide

## 🚀 Quick Start Guide

This guide will help you set up and use the automated Kanban project management system for your HanBin-Baik-Blog.

### Prerequisites

1. ✅ GitHub CLI installed (`gh`)
2. ✅ Authentication configured with `read:project` scope
3. ✅ Existing GitHub Project (ID: 1, "Person Blog")

### Step 1: Verify Authentication

```bash
# Check authentication
$ gh auth status

# If missing project scope, refresh authentication
$ gh auth refresh -s read:project
```

### Step 2: Initialize Kanban Board

```bash
# Make the automation script executable
$ chmod +x .github/scripts/kanban-automation.sh

# Run the initialization
$ .github/scripts/kanban-automation.sh

# Choose option 1: Initialize Kanban Board
```

### Step 3: Add Enhanced Status Options

The project already has basic status options. Let's enhance them:

```bash
# Add additional Kanban status options
$ gh api graphql -f query='
  mutation {
    addProjectV2SingleSelectOption(input: {
      projectId: "PVT_kwHOAPJAUs4BHRuM",
      fieldId: "PVTSSF_lAHOAPJAUs4BHRuMzg4FCFI",
      name: "Review"
    }) {
      singleSelectOption {
        id
        name
      }
    }
  }
'

$ gh api graphql -f query='
  mutation {
    addProjectV2SingleSelectOption(input: {
      projectId: "PVT_kwHOAPJAUs4BHRuM",
      fieldId: "PVTSSF_lAHOAPJAUs4BHRuMzg4FCFI",
      name: "Testing"
    }) {
      singleSelectOption {
        id
        name
      }
    }
  }
'
```

### Step 4: Add Priority Field

```bash
# Add Priority field
$ gh project field-create 1 --name "Priority" --type "single_select" \
  --options "High,Medium,Low,Urgent"

# Add Issue Type field
$ gh project field-create 1 --name "Issue Type" --type "single_select" \
  --options "Bug,Feature,Documentation,Performance,Infrastructure,CI/CD,Enhancement"

# Add Estimate field
$ gh project field-create 1 --name "Estimate (hours)" --type "number"
```

### Step 5: Set Up Automation Workflows

The workflows are already configured in `.github/workflows/kanban-automation.yml`

**Enable the workflows:**

```bash
# Enable the workflows in GitHub
$ gh workflow list
$ gh workflow enable kanban-automation.yml
$ gh workflow enable kanban-cleanup.yml
$ gh workflow enable kanban-metrics.yml
```

### Step 6: Test the System

```bash
# Test adding an issue to the project
$ .github/scripts/kanban-automation.sh
# Choose option 2: Add Issue to Project
# Enter issue number: 123

# Test adding a PR to the project
$ .github/scripts/kanban-automation.sh
# Choose option 3: Add PR to Project
# Enter PR number: 456

# Generate a test report
$ .github/scripts/kanban-automation.sh
# Choose option 6: Generate Weekly Report
```

## 📋 Kanban Board Structure

### Standard Kanban Columns

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   📥 Todo   │    │ 🔄 In Progress │  │  👥 Review   │  │  🛠️ Testing  │  │   ✅ Done   │
└──────────┬───┘    └──────────┬───┘    └──────────┬───┘    └──────────┬───┘    └──────────┬───┘
           │                   │                   │                   │                   │
           ▼                   ▼                   ▼                   ▼                   ▼
```

### Field Definitions

| Field | Type | Description | Example Values |
|-------|------|-------------|----------------|
| **Status** | Single Select | Current workflow stage | Todo, In Progress, Review, Testing, Done |
| **Priority** | Single Select | Work priority level | High, Medium, Low, Urgent |
| **Issue Type** | Single Select | Type of work | Bug, Feature, Documentation, Performance, Infrastructure |
| **Estimate** | Number | Time estimate in hours | 1, 2, 4, 8, 16 |
| **Assignees** | User | Who is working on it | @username |
| **Labels** | Labels | GitHub labels | bug, feature, performance |

## 🤖 Automation Rules

### Issue Lifecycle

```
Issue Created → Status: Todo → In Progress → Review → Testing → Done
```

**Triggers:**
- `gh issue opened` → Add to project, Status: Todo
- `gh issue labeled` → Update status based on label
- `gh issue closed` → Status: Done
- `gh issue reopened` → Status: Todo

### PR Lifecycle

```
PR Created → Status: In Progress → Review → Testing → Done
```

**Triggers:**
- `gh pr opened` → Add to project, Status: In Progress
- `gh pr review_requested` → Status: Review
- `gh pr approved` → Status: Testing
- `gh pr merged` → Status: Done
- `gh pr closed` → Status: Done

### Workflow Automations

1. **Performance Issues** → Auto-labeled + Status: Todo
2. **Infrastructure Issues** → Auto-labeled + Status: Todo
3. **CI/CD Failures** → Auto-labeled + Status: Todo
4. **High Priority Items** → Priority: High
5. **Bug Reports** → Issue Type: Bug

## 📊 Weekly Report

Generate a weekly report to track project health:

```bash
$ .github/scripts/kanban-automation.sh

# Choose option 6: Generate Weekly Report
```

**Sample Report:**
```
╔════════════════════════════════════════════════════════════╗
║        HanBin-Baik-Blog Weekly Kanban Report            ║
╚════════════════════════════════════════════════════════════╝

📊 Project Overview:
   Total Items: 24
   Todo: 8
   In Progress: 3
   Review: 2
   Testing: 1
   Done: 10

📈 Work in Progress: 12% (3/24)

🎯 Recommendations:
   ✅ You're doing great! WIP is within healthy limits.

📅 Next Steps:
   - Review items in 'Todo' and prioritize
   - Move items from 'In Progress' to 'Done'
   - Archive completed items older than 30 days

🔗 Project URL: https://github.com/users/hanbini96/projects/1
```

## 🛠️ Advanced Usage

### Bulk Operations

```bash
# Add multiple issues to project
for issue in 123 124 125 126; do
  .github/scripts/kanban-automation.sh <<< "2\n$issue\n9\n"
done

# Update status of multiple items
# (Would require additional scripting)
```

### Custom Status Transitions

```bash
# Manually update an item's status
gh project item-edit 1 --owner hanbini96 --id "PVTI_..." \
  --field-id "PVTSSF_lAHOAPJAUs4BHRuMzg4FCFI" --value "Done"
```

### Filter Items by Status

```bash
# List all Todo items
gh project item-list 1 --owner hanbini96 --filter "Status:Todo"

# List all items with Priority:High
gh project item-list 1 --owner hanbini96 --filter "Priority:High"

# List items by Issue Type
gh project item-list 1 --owner hanbini96 --filter "Issue Type:Bug"
```

## 📈 Metrics & Analytics

### Key Metrics to Track

1. **Cycle Time**: Time from Todo to Done
2. **Work in Progress (WIP)**: Number of items in progress
3. **Throughput**: Items completed per week
4. **Lead Time**: Time from issue creation to completion
5. **Blocked Items**: Items stuck in "Blocked" status

### Healthy Metrics

- ✅ WIP < 5 items
- ✅ Cycle Time < 7 days
- ✅ Throughput > 5 items/week
- ❌ No items stuck in "Blocked" for > 3 days

### Monitoring Scripts

```bash
# Check WIP limits
echo "WIP Items: $(gh project item-list 1 --owner hanbini96 --filter "Status:In Progress" | wc -l)"

# Check cycle time for completed items
# (Would require additional API calls to get timestamps)
```

## 🔧 Troubleshooting

### Common Issues

**Issue:** Script fails with authentication error
```bash
# Solution: Refresh authentication
$ gh auth refresh -s read:project
```

**Issue:** Item not added to project
```bash
# Solution: Check if item already exists in project
$ gh project item-list 1 --owner hanbini96 | grep "issue-number"
```

**Issue:** Status not updating
```bash
# Solution: Verify field IDs are correct
$ gh project field-list 1 --owner hanbini96
```

### Debug Mode

```bash
# Run script with debug output
bash -x .github/scripts/kanban-automation.sh
```

## 📚 Best Practices

### Workflow Best Practices

1. **Limit WIP**: Keep In Progress items < 5
2. **Prioritize**: Use Priority field for all items
3. **Estimate**: Add time estimates for all tasks
4. **Label**: Use Issue Type labels consistently
5. **Review**: Regularly review "Todo" items

### Project Management Tips

1. **Daily Standup**: Quick review of In Progress items
2. **Weekly Planning**: Review Todo items and prioritize
3. **Retrospective**: Review Done items for improvements
4. **Cleanup**: Archive items older than 30 days

### Integration with Existing Workflows

- **Performance Monitoring**: Auto-label performance issues
- **Infrastructure Monitoring**: Auto-label infrastructure issues
- **CI/CD**: Link failures to project items
- **Documentation**: Track docs improvements

## 🎯 Next Steps

1. ✅ Set up Kanban board
2. ✅ Configure automation workflows
3. ⏳ Train team on Kanban workflow
4. ⏳ Set up monitoring and alerts
5. ⏳ Review and optimize workflows

## 📞 Support

For issues or questions:
- Check `.github/KANBAN_AUTOMATION.md` for detailed documentation
- Review GitHub Actions logs for automation issues
- Run `.github/scripts/kanban-automation.sh` for interactive help

---

**Project:** HanBin-Baik-Blog  
**Owner:** hanbini96  
**Last Updated:** $(date)  
**Version:** 1.0.0