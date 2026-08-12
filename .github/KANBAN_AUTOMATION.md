# 🎯 HanBin-Baik-Blog Kanban Automation System

## 📋 Overview

This document describes the automated Kanban-style project management system for HanBin-Baik-Blog using GitHub Projects v2.

## 🎯 Project Structure

**Project ID:** 1 (Person Blog)
**Owner:** hanbini96
**Status Field ID:** PVTSSF_lAHOAPJAUs4BHRuMzg4FCFI

## 🏗️ Kanban Board Structure

### Standard Kanban Columns (Status Options):

1. **📥 Todo** - Issues/PRs ready to be worked on
2. **🔄 In Progress** - Active work in progress
3. **🔍 Review** - PRs ready for code review
4. **🛠️ Testing** - Items in testing/QA phase
5. **✅ Done** - Completed work

### Additional Status Options (Optional):
- **🚫 Blocked** - Blocked by external dependencies
- **📝 Backlog** - Ideas/issues to be prioritized
- **🔄 Waiting for Review** - PRs submitted for review

## 🤖 Automation Workflows

### 1. Issue Creation → Project Board
When new issues are created, they automatically:
- Get added to the project board
- Set status to "Todo" or "Backlog"
- Get labeled with issue type (bug, feature, docs, etc.)

### 2. PR Creation → Project Board
When PRs are created:
- Automatically added to project board
- Status set to "In Progress"
- Linked to original issue
- Reviewers added

### 3. Status Transition Automation
Based on GitHub events:
- **PR opened** → Status: "In Progress"
- **PR review requested** → Status: "Review"
- **PR approved** → Status: "Testing"
- **Issue closed** → Status: "Done"
- **PR merged** → Status: "Done"

### 4. Workflow Integration
- Performance issues → Auto-labeled + Status: "Todo"
- Infrastructure issues → Auto-labeled + Status: "Todo"
- Deployment issues → Auto-labeled + Status: "Todo"

## 📊 Metrics & Reporting

### Weekly Reports:
- Issues created vs resolved
- Average time in each status
- Work in progress limits
- Cycle time analysis

### Project Health Indicators:
- 🟢 < 3 items in "In Progress"
- 🟡 3-5 items in "In Progress"
- 🔴 > 5 items in "In Progress"

## 🛠️ Setup Commands

### Initialize Kanban Board:
```bash
gh project field-create 1 --name "Priority" --type "single_select" \
  --options "High,Medium,Low"

gh project field-create 1 --name "Issue_Type" --type "single_select" \
  --options "Bug,Feature,Documentation,Performance,Infrastructure,CI/CD"

gh project field-create 1 --name "Estimate" --type "number"
```

### Add Status Options:
```bash
gh api graphql -f query='
  mutation {
    updateProjectV2SingleSelectField(
      input: {
        projectId: "PVT_kwHOAPJAUs4BHRuM",
        fieldId: "PVTSSF_lAHOAPJAUs4BHRuMzg4FCFI",
        value: { singleSelectOptionId: "PVTSSFO_lAHOAPJAUs4BHRuMzg4FCFJ" }
      }
    ) {
      projectV2 {
        id
      }
    }
  }
'
```

## 📝 Usage Examples

### Add Issue to Project:
```bash
gh project item-add 1 --owner hanbini96 --url "https://github.com/hanbini96/HanBin-Baik-Blog/issues/123"
```

### Update Item Status:
```bash
gh project item-edit 1 --owner hanbini96 --id "PVTI_lAHOAPJAUs4BHRuMzg4FCFc" \
  --field-id "PVTSSF_lAHOAPJAUs4BHRuMzg4FCFI" --value "Done"
```

### List Items by Status:
```bash
gh project item-list 1 --owner hanbini96 --filter "Status:Todo"
```

## 🔧 Maintenance Scripts

### Cleanup Completed Items:
```bash
# Archive items older than 30 days in "Done" status
gh project item-list 1 --owner hanbini96 --filter "Status:Done" | \
  grep -v "Updated: <" | while read item; do
    # Archive logic here
  done
```

### Weekly Status Report:
```bash
# Generate weekly report
echo "=== Weekly Kanban Report ==="
echo "Total items: $(gh project item-list 1 --owner hanbini96 | wc -l)"
echo "Todo: $(gh project item-list 1 --owner hanbini96 --filter "Status:Todo" | wc -l)"
echo "In Progress: $(gh project item-list 1 --owner hanbini96 --filter "Status:In Progress" | wc -l)"
echo "Done: $(gh project item-list 1 --owner hanbini96 --filter "Status:Done" | wc -l)"
```

## 📚 Related Documentation

- [GitHub Projects v2 Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Projects Guide](https://cli.github.com/manual/gh_project)
- [Kanban Best Practices](https://kanban.university/what-is-kanban/)

## 🎯 Next Steps

1. ✅ Project board created
2. ⏳ Add enhanced status options
3. ⏳ Set up automation workflows
4. ⏳ Configure issue-PR synchronization
5. ⏳ Create monitoring scripts
6. ⏳ Document team workflows

---

**Last Updated:** $(date)
**Project:** HanBin-Baik-Blog
**Owner:** hanbini96