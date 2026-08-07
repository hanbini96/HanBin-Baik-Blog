# Performance Monitoring & Benchmarking Implementation

## Overview

This document describes the implementation of **Issue #5: Performance Monitoring & Benchmarking** for the HanBin-Baik-Blog project. This feature provides comprehensive performance tracking, benchmarking, and historical data collection to ensure optimal website performance.

## 🎯 Issue Details

**Issue**: #5 - Performance Monitoring & Benchmarking  
**Priority**: High  
**Estimated Effort**: 4-6 days  
**Status**: In Progress  
**Branch**: `feature/performance-monitoring-issue5`

---

## 📋 Implementation Plan

### Phase 1: Setup Foundation (Days 1-2)
- [ ] Create performance monitoring endpoints
- [ ] Set up Lighthouse CI integration
- [ ] Configure Core Web Vitals tracking
- [ ] Create benchmark documentation structure

### Phase 2: Automated Benchmarking (Days 3-4)
- [ ] Configure GitHub Actions for automated benchmarking
- [ ] Set up performance metrics collection
- [ ] Create historical tracking system
- [ ] Implement performance alerts

### Phase 3: Documentation & Optimization (Days 5-6)
- [ ] Document current performance baselines
- [ ] Create performance improvement guides
- [ ] Set up monitoring dashboards
- [ ] Review and optimize

---

## 🔧 Technical Implementation

### 1. Performance Monitoring Endpoints

#### Core Web Vitals Tracking
Create a performance monitoring endpoint that tracks key metrics:

```typescript
// src/pages/api/performance.json.ts
import { performance } from 'perf_hooks';

export async function GET() {
  const startTime = performance.now();
  
  // Simulate page load metrics
  const metrics = {
    timestamp: new Date().toISOString(),
    service: 'hanbin-baik-blog',
    version: '1.0.0',
    performance: {
      pageLoadTime: Math.round(Math.random() * 2000 + 500), // ms
      firstContentfulPaint: Math.round(Math.random() * 1500 + 300), // ms
      largestContentfulPaint: Math.round(Math.random() * 2500 + 800), // ms
      cumulativeLayoutShift: (Math.random() * 0.1).toFixed(3), // CLS score
      firstInputDelay: Math.round(Math.random() * 100 + 50), // ms
      totalBlockingTime: Math.round(Math.random() * 300 + 100), // ms
    },
    system: {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    }
  };
  
  return new Response(
    JSON.stringify(metrics, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}
```

### 2. Lighthouse CI Integration

Create Lighthouse configuration for automated performance testing:

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['https://hanbini96.github.io/HanBin-Baik-Blog/'],
      settings: {
        chromeFlags: '--no-sandbox',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'first-contentful-paint': ['warn', { maxLength: 1500 }],
        'largest-contentful-paint': ['error', { maxLength: 2500 }],
        'cumulative-layout-shift': ['error', { maxTotal: 0.1 }],
        'first-input-delay': ['warn', { maxNumeric: 100 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 3. GitHub Actions Benchmarking Workflow

Enhanced GitHub Actions workflow with performance monitoring:

```yaml
# .github/workflows/performance.yml
name: Performance Monitoring

on:
  push: { branches: [ main, dev-update ] }
  pull_request:
    branches: [ main, dev-update ]
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM UTC
  workflow_dispatch: {}

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://hanbini96.github.io/HanBin-Baik-Blog/
            https://hanbini96.github.io/HanBin-Baik-Blog/blog
            https://hanbini96.github.io/HanBin-Baik-Blog/about
          uploadArtifacts: true
          temporaryPublicStorage: true
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  performance-benchmark:
    needs: lighthouse
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: npm install -g lighthouse
      
      - name: Run Performance Benchmark
        run: |
          # Collect performance metrics
          lighthouse https://hanbini96.github.io/HanBin-Baik-Blog/ \
            --output=json \
            --output-path=./lighthouse-report.json \
            --chrome-flags="--no-sandbox"
          
          # Parse and store metrics
          METRICS=$(node -e "
            const data = require('./lighthouse-report.json');
            const perf = data.lhr.categories.performance.score * 100;
            const fcp = data.lhr.audits['first-contentful-paint'].numericValue;
            const lcp = data.lhr.audits['largest-contentful-paint'].numericValue;
            const cls = data.lhr.audits['cumulative-layout-shift'].numericValue;
            const fid = data.lhr.audits['first-input-delay'].numericValue;
            const tbt = data.lhr.audits['total-blocking-time'].numericValue;
            
            console.log(JSON.stringify({
              performanceScore: Math.round(perf),
              firstContentfulPaint: Math.round(fcp),
              largestContentfulPaint: Math.round(lcp),
              cumulativeLayoutShift: cls.toFixed(3),
              firstInputDelay: Math.round(fid),
              totalBlockingTime: Math.round(tbt)
            }));
          ")
          
          echo "$METRICS" > performance-metrics.json
          
          # Commit to performance history
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add performance-metrics.json
          git commit -m "chore: Update performance metrics [skip ci]"
          git push
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  performance-alerts:
    needs: performance-benchmark
    runs-on: ubuntu-latest
    if: failure()
    steps:
      - name: Send Performance Alert
        run: |
          echo "⚠️ Performance regression detected!"
          echo "Check the performance benchmark results"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Historical Performance Tracking

Create a system to track performance metrics over time:

```bash
# scripts/performance-tracker.sh
#!/bin/bash

# Performance metrics tracker
# Collects and stores performance data historically

PERF_DATA_DIR=".performance-history"
mkdir -p "$PERF_DATA_DIR"

# Get current metrics
DATE=$(date +%Y-%m-%d_%H-%M-%S)
METRICS=$(curl -s https://hanbini96.github.io/HanBin-Baik-Blog/api/performance.json)

# Store metrics
echo "$METRICS" > "$PERF_DATA_DIR/perf-$DATE.json"

# Generate summary
echo "Performance metrics collected at $DATE"
echo "$METRICS" | jq '.performance'
```

### 5. Performance Documentation

Create benchmark documentation structure:

```markdown
# Performance Benchmarks

## Current Baselines

### Core Web Vitals (Google Recommendations)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5s - 4s | > 4s |
| FID | < 100ms | 100ms - 300ms | > 300ms |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Current Performance (Last Updated: $(date))

```json
{
  "lighthouseScore": 95,
  "firstContentfulPaint": 1200,
  "largestContentfulPaint": 1800,
  "cumulativeLayoutShift": 0.05,
  "firstInputDelay": 45,
  "totalBlockingTime": 80
}
```

## Historical Trends

- [Performance History Dashboard](#)
- [Benchmark Comparisons](#)
- [Optimization Recommendations](#)
```

---

## 📊 Performance Metrics to Track

### Core Web Vitals (Google's Key Metrics)
1. **LCP (Largest Contentful Paint)** - Measures loading performance
   - Target: < 2.5 seconds
   - Impact: User perception of speed

2. **FID (First Input Delay)** - Measures interactivity
   - Target: < 100 milliseconds
   - Impact: User experience responsiveness

3. **CLS (Cumulative Layout Shift)** - Measures visual stability
   - Target: < 0.1
   - Impact: Prevents annoying layout jumps

### Additional Performance Metrics
4. **FCP (First Contentful Paint)** - When content first appears
5. **TTFB (Time to First Byte)** - Server response time
6. **Total Blocking Time** - Main thread responsiveness
7. **Page Load Time** - Full page load duration
8. **Bundle Size** - JavaScript/CSS bundle sizes
9. **Image Optimization** - Image file sizes and formats
10. **Cache Hit Ratio** - CDN and browser caching effectiveness

---

## 🔧 Setup Instructions

### Prerequisites

1. **Node.js & npm** - For Lighthouse CLI
   ```bash
   node -v  # Should be v18+
   npm -v
   ```

2. **Lighthouse CLI** - Install globally
   ```bash
   npm install -g lighthouse
   ```

3. **GitHub CLI** - For workflow management
   ```bash
   gh --version
   ```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/hanbini96/HanBin-Baik-Blog.git
   cd HanBin-Baik-Blog
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Lighthouse CI**
   ```bash
   npm install -g @lhci/cli
   lhci wizard
   ```

4. **Configure GitHub Secrets**
   ```bash
   # Add LHCI GitHub App token
   gh secret set LHCI_GITHUB_APP_TOKEN --body "your-app-token"
   ```

5. **Test locally**
   ```bash
   pnpm run dev
   curl http://localhost:4321/api/performance.json
   ```

---

## 🚀 GitHub Actions Workflows

### Performance Monitoring Workflow

File: `.github/workflows/performance.yml`

Triggers:
- ✅ On push to main/dev-update
- ✅ On pull requests to main/dev-update
- ✅ Weekly scheduled runs (Monday 2 AM UTC)
- ✅ Manual trigger (workflow_dispatch)

Jobs:
1. **lighthouse** - Runs Lighthouse audits
2. **performance-benchmark** - Collects and stores metrics
3. **performance-alerts** - Sends alerts on failures

### Enhanced GitHub Pages Workflow

File: `.github/workflows/github_pages.yml`

Added performance tracking:
- Performance metrics collection
- Historical data storage
- Automated benchmarking

---

## 📈 Benchmark Targets

### Performance Score Targets

| Category | Target Score | Current Score |
|----------|--------------|---------------|
| Performance | 95+ | TBD |
| Accessibility | 100 | TBD |
| Best Practices | 100 | TBD |
| SEO | 100 | TBD |

### Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | TBD |
| FID | < 100ms | TBD |
| CLS | < 0.1 | TBD |

### Historical Tracking

- Store metrics for 90 days
- Track weekly averages
- Compare against previous periods
- Generate trend reports

---

## 🎯 Optimization Strategies

### Immediate Optimizations (Priority 1)

1. **Image Optimization**
   - Convert to WebP format
   - Implement responsive images
   - Add lazy loading
   - Set width/height attributes

2. **JavaScript Optimization**
   - Code splitting
   - Tree shaking
   - Minification
   - Bundle analysis

3. **CSS Optimization**
   - Critical CSS extraction
   - Minification
   - Reduce unused CSS

### Medium-term Optimizations (Priority 2)

1. **CDN Integration**
   - Set up CDN for static assets
   - Enable caching headers
   - Implement edge caching

2. **Preloading Strategies**
   - Preload critical resources
   - Prefetch next pages
   - Preconnect to third parties

3. **Font Optimization**
   - Use system fonts as fallback
   - Implement font display swap
   - Self-host fonts

### Long-term Optimizations (Priority 3)

1. **Advanced Caching**
   - Service worker for offline support
   - Cache API responses
   - Implement stale-while-revalidate

2. **Performance Budgets**
   - Set bundle size limits
   - Enforce image size limits
   - Monitor third-party impact

3. **Real User Monitoring**
   - Plausible Analytics integration
   - Performance monitoring scripts
   - User journey tracking

---

## 📊 Monitoring & Dashboards

### Lighthouse CI Reports

Generated after each run:
- Performance score
- Accessibility score
- Best practices score
- SEO score
- Individual audit results

### Historical Performance Data

Stored in `.performance-history/` directory:
- Weekly snapshots
- Trend analysis
- Comparison reports
- Alert history

### GitHub Actions Logs

- Performance benchmark results
- Alert notifications
- Historical comparisons
- Optimization recommendations

---

## 🔍 Troubleshooting

### Common Issues

#### Lighthouse Scores Too Low
**Possible Causes:**
- Large JavaScript bundles
- Unoptimized images
- Render-blocking resources
- Slow server response

**Solutions:**
1. Run `npm run build` and analyze bundles
2. Optimize images with `sharp` or `squoosh`
3. Implement code splitting
4. Add caching headers

#### Performance Tests Failing
**Possible Causes:**
- Network issues during test
- Resource loading failures
- Timeout settings too low
- GitHub Actions rate limits

**Solutions:**
1. Check GitHub Actions logs
2. Increase timeout settings
3. Retry the workflow
4. Test locally with Lighthouse CLI

#### Historical Data Not Updating
**Possible Causes:**
- Git push permissions
- File path issues
- GitHub Actions token expired
- Branch protection rules

**Solutions:**
1. Check GitHub Actions permissions
2. Verify file paths
3. Regenerate GitHub token
4. Check branch protection

---

## 📞 Support & Resources

### Documentation Files
- [INFRASTRUCTURE_MONITORING.md](../INFRASTRUCTURE_MONITORING.md) - Infrastructure monitoring setup
- [BENCHMARKS.md](BENCHMARKS.md) - Performance benchmark targets
- [PERFORMANCE_MONITORING.md](PERFORMANCE_MONITORING.md) - This file

### Tools & Services
- **Lighthouse**: https://developer.chrome.com/docs/lighthouse/overview/
- **LHCI**: https://github.com/GoogleChrome/lighthouse-ci
- **WebPageTest**: https://www.webpagetest.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/

### Learning Resources
- **Core Web Vitals**: https://web.dev/articles/vitals
- **Performance Optimization**: https://web.dev/performance/
- **Astro Performance**: https://docs.astro.build/en/guides/deploy/#performance
- **Supabase Performance**: https://supabase.com/docs/guides/performance

---

## 🎉 Implementation Checklist

### Phase 1: Foundation
- [ ] Create performance monitoring endpoint
- [ ] Set up Lighthouse CI configuration
- [ ] Configure GitHub Actions workflow
- [ ] Create historical tracking system
- [ ] Document current baselines

### Phase 2: Automation
- [ ] Set up automated benchmarking
- [ ] Configure performance alerts
- [ ] Implement historical data collection
- [ ] Create performance reports
- [ ] Set up monitoring dashboards

### Phase 3: Optimization
- [ ] Run initial performance tests
- [ ] Identify optimization opportunities
- [ ] Implement quick wins
- [ ] Document optimization strategies
- [ ] Set up continuous monitoring

---

## 📝 Notes

### Static Site Considerations
- Astro builds static HTML files
- No server-side processing at runtime
- Performance is determined at build time
- Optimize during build process

### GitHub Pages Limitations
- No serverless functions on free tier
- Performance monitoring must be pre-build
- Use Lighthouse CI for automated testing
- Monitor deployment artifacts

### Future Enhancements
- Real User Monitoring (RUM) with Plausible
- Advanced caching strategies
- Performance budgets in CI/CD
- Automated optimization suggestions

---

**Maintained by**: hanbini96  
**Last Updated**: $(date)  
**Next Review**: September 2026