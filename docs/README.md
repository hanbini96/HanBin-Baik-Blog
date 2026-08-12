# HanBin-Baik-Blog Documentation

Welcome to the comprehensive documentation for **HanBin-Baik-Blog** - your Astro + Supabase blog starter template.

## 📚 Documentation Structure

This documentation is organized by topic for easy navigation:

### 🚀 Getting Started
- **[Quick Start Guide](getting-started/QUICK_START_GUIDE.md)** - Get up and running quickly
- **[Node.js Version Guide](development/NODE_VERSION_GUIDE.md)** - Node.js and pnpm setup
- **[Lighthouse Setup](performance/LIGHTHOUSE_SETUP.md)** - Performance monitoring setup

### 💻 Development
- **[Development Guide](development/DEV-GUIDE.md)** - Complete development workflow
- **[pnpm 11+ Fixes](troubleshooting/PNPM_11_PLUS_FIXES.md)** - Common pnpm security configuration issues

### ⚡ Performance
- **[Benchmarks](performance/BENCHMARKS.md)** - Performance metrics and targets
- **[Performance Monitoring](performance/PERFORMANCE_MONITORING.md)** - Performance tracking and optimization

### 🏗️ Infrastructure
- **[Infrastructure Monitoring](infrastructure/INFRASTRUCTURE_MONITORING.md)** - Infrastructure health checks and monitoring

### 🛠️ Troubleshooting
- **[Workflow Failure Assessment](troubleshooting/WORKFLOW_FAILURE_ASSESSMENT.md)** - GitHub Actions troubleshooting
- **[Workflow Fix Strategy](troubleshooting/WORKFLOW_FIX_STRATEGY.md)** - Workflow optimization strategies

## 🎯 Quick Links

### Project Resources
- **[Main README](../../README.md)** - Project overview and setup
- **[GitHub Repository](https://github.com/hanbini96/HanBin-Baik-Blog)** - Source code and issues
- **[Supabase Dashboard](https://app.supabase.com)** - Database and authentication management

### Development Tools
- **Local Development**: `pnpm dev`
- **Production Build**: `pnpm build`
- **Preview**: `pnpm preview`
- **Linting**: `pnpm run lint`
- **Formatting**: `pnpm run format`

### Performance Monitoring
- **Lighthouse CI**: Automated performance audits
- **GitHub Actions**: Performance benchmarking workflows
- **Plausible Analytics**: Real user monitoring (recommended)

### Infrastructure
- **Status Page**: `/status.json` - Static status information
- **Uptime Monitoring**: GitHub Actions scheduled checks
- **Health Checks**: Infrastructure monitoring setup

## 📊 Key Metrics

### Current Performance Targets
- **Performance Score**: 95+/100 (Excellent)
- **LCP**: < 2.5s (Good)
- **FID**: < 100ms (Excellent)
- **CLS**: < 0.1 (Excellent)

### Monitoring Tools
- **Lighthouse CI**: Automated audits on PRs
- **GitHub Actions**: Weekly performance benchmarks
- **Plausible Analytics**: Real user monitoring
- **UptimeRobot**: External uptime monitoring

## 🔧 Development Workflow

### Branch Strategy
- **main**: Production-ready code
- **dev-update**: Development branch for testing
- **feature/[name]**: Individual feature branches

### GitHub Actions
- **deploy.yml**: GitHub Pages deployment
- **performance.yml**: Performance monitoring
- **infrastructure.yml**: Infrastructure health checks

### Database
- **Migrations**: `supabase/migrations/` directory
- **RLS Policies**: Enabled for security
- **Supabase**: PostgreSQL database with free tier

## 📈 Performance Optimization

### Quick Wins
1. **Image Optimization**: Convert to WebP, lazy loading
2. **JavaScript**: Code splitting, tree shaking
3. **CSS**: Critical CSS extraction, minification
4. **CDN**: Faster global asset delivery

### Advanced
1. **Service Worker**: Offline support and caching
2. **Performance Budgets**: Automated size limits
3. **Real User Monitoring**: Plausible Analytics integration
4. **Advanced Caching**: Stale-while-revalidate strategies

## 🚨 Troubleshooting

### Common Issues
- **pnpm errors**: See [pnpm 11+ Fixes](troubleshooting/PNPM_11_PLUS_FIXES.md)
- **Database connection**: Verify Supabase secrets
- **Authentication**: Check Supabase Auth settings
- **Build failures**: Review GitHub Actions logs

### Support
- **GitHub Issues**: https://github.com/hanbini96/HanBin-Baik-Blog/issues
- **Supabase Docs**: https://supabase.com/docs
- **Astro Docs**: https://docs.astro.build

## 📅 Maintenance Schedule

### Weekly
- Performance benchmarks (Monday 2 AM UTC)
- Infrastructure health checks
- GitHub Actions monitoring

### Monthly
- Review performance trends
- Update benchmarks
- Clean up old files
- Archive completed work

### Quarterly
- Major dependency updates
- Performance optimization reviews
- Documentation updates
- Security audits

---

**Last Updated**: August 2026  
**Project Version**: 2.0.0  
**Maintainer**: HanBin Baik (@hanbini96)

---

📚 **Browse the documentation sections above to get started!**