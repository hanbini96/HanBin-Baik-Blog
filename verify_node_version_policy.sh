#!/bin/bash
# Node Version Policy Verification Script
# Ensures all configurations match the NODE_VERSION_POLICY.md

set -e

echo "🔍 Verifying Node.js Version Policy Compliance"
echo "=============================================="
echo ""

# Check 1: Verify .nvmrc exists and has correct version
echo "✓ Check 1: .nvmrc file"
if [ -f ".nvmrc" ]; then
    NODE_VERSION=$(cat .nvmrc)
    if [ "$NODE_VERSION" = "22" ]; then
        echo "  ✅ .nvmrc contains: $NODE_VERSION"
    else
        echo "  ❌ .nvmrc contains: $NODE_VERSION (expected 22)"
        exit 1
    fi
else
    echo "  ❌ .nvmrc file not found"
    exit 1
fi

# Check 2: Verify package.json engines
echo ""
echo "✓ Check 2: package.json engines"
if grep -q '"node": ">=22.0.0"' package.json; then
    echo "  ✅ package.json requires Node >=22.0.0"
else
    echo "  ❌ package.json does not require Node >=22.0.0"
    exit 1
fi

# Check 3: Verify workflow files use Node 22
echo ""
echo "✓ Check 3: GitHub Workflows"
WORKFLOW_FILES=".github/workflows/performance.yml .github/workflows/infrastructure.yml"

for file in $WORKFLOW_FILES; do
    if [ -f "$file" ]; then
        if grep -q "node-version: 22" "$file"; then
            echo "  ✅ $file uses Node 22"
        else
            echo "  ❌ $file does not use Node 22"
            exit 1
        fi
        
        if grep -q "node-version: 24" "$file"; then
            echo "  ❌ $file still contains Node 24"
            exit 1
        fi
    else
        echo "  ⚠️  $file not found"
    fi
done

# Check 4: Verify NODE_VERSION_POLICY.md exists
echo ""
echo "✓ Check 4: Policy Documentation"
if [ -f "NODE_VERSION_POLICY.md" ]; then
    echo "  ✅ NODE_VERSION_POLICY.md exists"
    if grep -q "node-version: 22" NODE_VERSION_POLICY.md; then
        echo "  ✅ Policy document references Node 22"
    fi
else
    echo "  ❌ NODE_VERSION_POLICY.md not found"
    exit 1
fi

# Check 5: Verify no Node 24 references remain
echo ""
echo "✓ Check 5: No Node 24 references"
NODE24_REFS=$(grep -r "node-version: 24" .github/workflows/ 2>/dev/null || true)
if [ -z "$NODE24_REFS" ]; then
    echo "  ✅ No Node 24 references found in workflows"
else
    echo "  ❌ Found Node 24 references:"
    echo "$NODE24_REFS"
    exit 1
fi

# Summary
echo ""
echo "=============================================="
echo "✅ ALL CHECKS PASSED"
echo ""
echo "Node Version Policy is fully enforced:"
echo "  - Local development: Node 22 (via .nvmrc)"
echo "  - CI/CD workflows: Node 22"
echo "  - Package requirements: Node >=22.0.0"
echo "  - Policy documentation: Updated"
echo ""
echo "🎯 Next Steps:"
echo "  1. Run: nvm install 22 (if not already installed)"
echo "  2. Run: nvm use 22"
echo "  3. Run: pnpm install"
echo "  4. Test locally: pnpm dev"
echo ""
echo "🚀 Workflow failures due to Node version should now be resolved!"
