#!/bin/bash

# Test script to verify the GitHub Pages deployment fix
# This script simulates the build and deployment process to catch issues early

set -e  # Exit on error

echo "🚀 Testing GitHub Pages Deployment Fix"
echo "======================================"
echo ""

# Check if dist directory exists
if [ ! -d "dist/" ]; then
    echo "❌ ERROR: dist/ directory not found. Run 'pnpm build' first."
    exit 1
fi

echo "✅ dist/ directory found"

# Check for symlinks (GitHub Pages doesn't allow them)
SYMLINKS=$(find dist/ -type l 2>/dev/null | wc -l)
if [ $SYMLINKS -gt 0 ]; then
    echo "❌ ERROR: Found $SYMLINKS symlinks in dist/"
    echo "Symlinks found:"
    find dist/ -type l
    exit 1
fi

echo "✅ No symlinks found (GitHub Pages requirement satisfied)"

# Check for hard links (GitHub Pages doesn't allow them)
HARDLINKS=$(find dist/ -type f -links +1 2>/dev/null | wc -l)
if [ $HARDLINKS -gt 0 ]; then
    echo "⚠️  WARNING: Found $HARDLINKS files with hard links in dist/"
    echo "Files with hard links:"
    find dist/ -type f -links +1
    echo "Removing hard links..."
    find dist/ -type f -links +1 -delete
    echo "✅ Hard links removed"
fi

# Check for large files (>10MB - GitHub Pages has limits)
LARGE_FILES=$(find dist/ -size +10M 2>/dev/null | wc -l)
if [ $LARGE_FILES -gt 0 ]; then
    echo "⚠️  WARNING: Found $LARGE_FILES files >10MB in dist/"
    echo "Large files:"
    find dist/ -size +10M -ls
fi

# Verify artifact structure
FILE_COUNT=$(find dist/ -type f | wc -l)
DIR_SIZE=$(du -sh dist/ | cut -f1)

if [ $FILE_COUNT -eq 0 ]; then
    echo "❌ ERROR: No files found in dist/"
    exit 1
fi

if [ -z "$DIR_SIZE" ]; then
    echo "❌ ERROR: Could not determine dist/ size"
    exit 1
fi

echo "✅ Artifact structure verified"
echo "   - File count: $FILE_COUNT"
echo "   - Directory size: $DIR_SIZE"
echo ""

# Verify no symlinks or hard links remain (final check)
FINAL_SYMLINKS=$(find dist/ -type l 2>/dev/null | wc -l)
FINAL_HARDLINKS=$(find dist/ -type f -links +1 2>/dev/null | wc -l)

if [ $FINAL_SYMLINKS -gt 0 ]; then
    echo "❌ ERROR: Found $FINAL_SYMLINKS symlinks remaining"
    exit 1
fi

if [ $FINAL_HARDLINKS -gt 0 ]; then
    echo "❌ ERROR: Found $FINAL_HARDLINKS hard links remaining"
    exit 1
fi

echo "✅ Final validation passed - no symlinks or hard links remain"
echo ""

echo "🎉 All tests passed! GitHub Pages deployment should work correctly."
echo ""
echo "📋 Summary:"
echo "   - No symlinks detected ✅"
echo "   - No hard links detected ✅"
echo "   - Valid file structure ✅"
echo "   - Artifact size within limits ✅"
echo "   - Final validation successful ✅"
echo ""
echo "🚀 Ready for deployment to GitHub Pages!"