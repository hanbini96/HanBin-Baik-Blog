#!/bin/bash

# 📊 Quick Benchmark Checker for hanbin-blog-github skill
# Run this to check current performance metrics

set -euo pipefail

SKILL_DIR="~/.pi/agent/skills/hanbin-blog-github"
BENCHMARK_FILE="PI_SKILL_OPTIMIZATION_BENCHMARKS.md"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if skill exists
if [ ! -d "$SKILL_DIR" ]; then
    echo -e "${RED}❌ Skill directory not found: $SKILL_DIR${NC}"
    echo "Please ensure the skill is installed."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) not installed${NC}"
fi

# Check if pi is available
if ! command -v pi &> /dev/null; then
    echo -e "${YELLOW}⚠️  Pi agent (pi) not available${NC}"
fi

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Pi Skill Benchmark Checker             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# 1. Context Size Check
echo -e "${BLUE}📊 1. Context Size Check${NC}"
total_size=$(du -sb "$SKILL_DIR" 2>/dev/null | cut -f1 || echo "0")
echo "   Skill Directory Size: $total_size bytes"

if [ "$total_size" -lt 15000 ]; then
    echo -e "   ${GREEN}✅ PASS${NC} (Target: <15KB, Actual: ${total_size} bytes)"
else
    echo -e "   ${YELLOW}⚠️  WARNING${NC} (Target: <15KB, Actual: ${total_size} bytes)"
fi
echo ""

# 2. File Count Check
echo -e "${BLUE}📁 2. File Structure Check${NC}"
file_count=$(find "$SKILL_DIR" -name "*.md" -o -name "*.sh" | wc -l)
echo "   Total Files: $file_count"

if [ "$file_count" -ge 8 ]; then
    echo -e "   ${GREEN}✅ PASS${NC} (Expected: ≥8 files)"
else
    echo -e "   ${RED}❌ FAIL${NC} (Expected: ≥8 files, Found: $file_count)"
fi
echo ""

# 3. Skill Loading Test (if pi available)
if command -v pi &> /dev/null; then
    echo -e "${BLUE}🚀 3. Skill Loading Test${NC}"
    
    start_time=$(date +%s%N)
    if pi "Activate hanbin-blog-github" > /tmp/skill-load-test.txt 2>&1; then
        end_time=$(date +%s%N)
        load_time=$(( (end_time - start_time) / 1000000 ))
        
        if grep -q "activated" /tmp/skill-load-test.txt 2>/dev/null; then
            echo "   Skill loaded in ${load_time}ms"
            if [ $load_time -lt 1500 ]; then
                echo -e "   ${GREEN}✅ PASS${NC} (Target: <1.5s, Actual: ${load_time}ms)"
            else
                echo -e "   ${YELLOW}⚠️  WARNING${NC} (Target: <1.5s, Actual: ${load_time}ms)"
            fi
        else
            echo -e "   ${RED}❌ FAIL${NC} - Skill did not activate properly"
        fi
    else
        echo -e "   ${RED}❌ FAIL${NC} - Skill activation failed"
    fi
    echo ""
fi

# 4. Command Execution Test (if pi available)
if command -v pi &> /dev/null; then
    echo -e "${BLUE}⚡ 4. Command Execution Test${NC}"
    
    start_time=$(date +%s%N)
    if pi "Check repository status" > /tmp/cmd-exec-test.txt 2>&1; then
        end_time=$(date +%s%N)
        exec_time=$(( (end_time - start_time) / 1000000 ))
        
        if [ $exec_time -lt 1500 ]; then
            echo "   Command executed in ${exec_time}ms"
            echo -e "   ${GREEN}✅ PASS${NC} (Target: <1.5s, Actual: ${exec_time}ms)"
        else
            echo "   Command executed in ${exec_time}ms"
            echo -e "   ${YELLOW}⚠️  WARNING${NC} (Target: <1.5s, Actual: ${exec_time}ms)"
        fi
    else
        echo -e "   ${RED}❌ FAIL${NC} - Command execution failed"
    fi
    echo ""
fi

# 5. Documentation Check
echo -e "${BLUE}📚 5. Documentation Check${NC}"
if [ -f "$BENCHMARK_FILE" ]; then
    echo "   Benchmark file: $BENCHMARK_FILE"
    echo -e "   ${GREEN}✅ PASS${NC} - Benchmark tracking active"
else
    echo -e "   ${YELLOW}⚠️  WARNING${NC} - Benchmark file not found"
fi
echo ""

# 6. GitHub CLI Check
echo -e "${BLUE}🔧 6. GitHub CLI Check${NC}"
if command -v gh &> /dev/null; then
    gh_version=$(gh --version | head -1)
    echo "   GitHub CLI: $gh_version"
    echo -e "   ${GREEN}✅ PASS${NC} - GitHub CLI installed"
else
    echo -e "   ${YELLOW}⚠️  WARNING${NC} - GitHub CLI not installed"
fi
echo ""

# Summary
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            Benchmark Summary                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "📊 All benchmarks checked!"
echo ""
echo "🔧 To update benchmarks:"
echo "   nano PI_SKILL_OPTIMIZATION_BENCHMARKS.md"
echo ""
echo "📅 Next check: $(date -d '+7 days' '+%Y-%m-%d')"
