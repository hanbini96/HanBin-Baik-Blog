# Infrastructure Monitoring & Health Checks Implementation

## Overview

This document describes the infrastructure monitoring and health check system implemented for the HanBin-Baik-Blog project. The system provides real-time monitoring of service health, database connectivity, and system performance.

## Implemented Features

### 1. Health Check Endpoints

#### Basic Health Check (`/api/health.ts`)
- **Endpoint**: `/api/health`
- **Method**: GET, POST, HEAD
- **Response**: Simple health status
- **Cache**: No cache (always fresh data)

**Example Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-05T00:35:00.000Z",
  "service": "hanbin-baik-blog",
  "version": "1.0.0",
  "checks": {
    "database": "connected",
    "cache": "available",
    "dependencies": "operational"
  }
}
```

#### Comprehensive Health Check (`/api/health.json.ts`)
- **Endpoint**: `/api/health.json`
- **Method**: GET, POST, HEAD
- **Response**: Detailed health status with Supabase connectivity
- **Cache**: No cache

**Example Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-05T00:35:00.000Z",
  "service": "hanbin-baik-blog",
  "version": "1.0.0",
  "uptime": 1234.56,
  "memoryUsage": {
    "rss": 123456789,
    "heapTotal": 87654321,
    "heapUsed": 45678901
  },
  "checks": {
    "database": "connected",
    "cache": "available",
    "dependencies": "operational",
    "environment": "production"
  },
  "databaseStatus": {
    "error": null,
    "responseTime": "fast",
    "connection": "established"
  }
}
```

### 2. GitHub Actions Monitoring Integration

Enhanced the deployment workflow to include:

#### Scheduled Health Checks
- **Cron Schedule**: Every 30 minutes
- **Purpose**: Regular health monitoring
- **Trigger**: `schedule` event in GitHub Actions

#### Deployment Monitoring
- **Health Check Job**: Verifies service availability after deployment
- **Uptime Monitoring Job**: Tests reliability with multiple requests
- **Failure Alerts**: Automatically fails workflow if health checks don't pass

### 3. Monitoring Workflow Configuration

The enhanced `.github/workflows/github_pages.yml` includes:

```yaml
on:
  push: { branches: [ main ] }
  workflow_dispatch: {}
  schedule:
    - cron: '*/30 * * * *'  # Run every 30 minutes for health checks
```

**Jobs:**
1. **build**: Standard build process
2. **deploy**: GitHub Pages deployment
3. **health-check**: Verifies health endpoint response
4. **uptime-monitoring**: Tests service reliability

### 4. Monitoring Integration Points

#### Supabase Monitoring
- **Database Connectivity**: Health checks verify Supabase connection
- **Query Performance**: Basic response time monitoring
- **Error Handling**: Graceful degradation when database is unavailable

#### System Monitoring
- **Memory Usage**: Tracks RSS, heap total, and heap used
- **Uptime Tracking**: Monitors process uptime
- **Environment Status**: Reports current environment (dev/staging/prod)

## Setup Instructions

### Prerequisites

1. **GitHub Repository**: Ensure repository has GitHub Actions enabled
2. **Secrets**: Add required secrets to GitHub repository:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
3. **Environment Variables**: Configure in Astro project:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`

### Installation Steps

1. **Add Health Check Endpoints**
   ```bash
   # Create health check files
   touch src/pages/api/health.ts
   touch src/pages/api/health.json.ts
   ```

2. **Update GitHub Actions Workflow**
   ```bash
   # Edit .github/workflows/github_pages.yml
   git add .github/workflows/github_pages.yml
   git commit -m "Add infrastructure monitoring workflow"
   ```

3. **Configure Secrets**
   ```bash
   # Add secrets via GitHub UI or CLI
   gh secret set SUPABASE_URL --body "https://your-project.supabase.co"
   gh secret set SUPABASE_ANON_KEY --body "your-anon-key"
   ```

4. **Test Health Endpoints**
   ```bash
   # Test locally
   pnpm run dev
   curl http://localhost:4321/api/health.json
   
   # Test in production
   curl https://your-domain.com/api/health.json
   ```

## Monitoring Tools Integration

### Recommended Monitoring Services

#### 1. UptimeRobot (Free Tier Available)
- **Purpose**: Website uptime monitoring
- **Setup**: Add health endpoint URL
- **Interval**: 5 minutes (free tier)
- **Alerts**: Email, SMS, webhook

**Configuration:**
```
URL: https://your-domain.com/api/health.json
Check Interval: 5 minutes
Alert Contacts: Add your email/phone
```

#### 2. GitHub Actions Monitoring
- **Purpose**: CI/CD pipeline health
- **Setup**: Built into workflow
- **Interval**: 30 minutes (scheduled)
- **Alerts**: GitHub notifications, email

#### 3. Custom Dashboards
- **Purpose**: Real-time monitoring
- **Setup**: Use health endpoint data
- **Tools**: Grafana, Datadog, New Relic

### Alerting Configuration

#### Critical Alerts
- **Uptime drops below 99.9%**
- **Health check returns 503**
- **Database connectivity lost**
- **Memory usage exceeds thresholds**

#### Warning Alerts
- **Performance degradation trends**
- **Increased error rates**
- **Traffic spikes**
- **Resource utilization warnings**

## Performance Metrics

### Key Metrics Tracked

1. **Response Time**: Time to complete health check request
2. **Status Code**: HTTP status from health endpoint
3. **Uptime Percentage**: Service availability over time
4. **Error Rate**: Percentage of failed health checks
5. **Memory Usage**: System resource consumption

### Benchmark Targets

- **Health Check Response Time**: < 500ms
- **Uptime Percentage**: > 99.9%
- **Error Rate**: < 0.1%
- **Memory Usage**: < 500MB (RSS)

## Maintenance and Updates

### Regular Tasks

1. **Weekly Review**
   - Check health check logs
   - Review uptime reports
   - Update monitoring thresholds

2. **Monthly Review**
   - Analyze performance trends
   - Update documentation
   - Review alert thresholds

3. **Quarterly Review**
   - Comprehensive monitoring audit
   - Update monitoring tools
   - Review and optimize configurations

### Documentation Updates

- Update this file when making changes
- Document new monitoring features
- Update benchmark targets as needed
- Maintain alert configuration

## Troubleshooting

### Common Issues

#### Health Check Returns 503
**Possible Causes:**
- Supabase connection failed
- Environment variables missing
- Database query timeout
- Service overloaded

**Solutions:**
1. Check Supabase credentials
2. Verify database connectivity
3. Review error logs
4. Check memory usage

#### Health Check Slow Response
**Possible Causes:**
- Database query slow
- Network latency
- Service under load
- Cold start (first request)

**Solutions:**
1. Optimize database queries
2. Add caching layer
3. Scale resources
4. Warm up service

#### GitHub Actions Fails
**Possible Causes:**
- Secrets not configured
- Health endpoint changed
- Service temporarily unavailable
- Network issues

**Solutions:**
1. Verify secrets in GitHub
2. Test health endpoint manually
3. Check GitHub Actions logs
4. Retry workflow

## Advanced Configuration

### Custom Health Checks

Add additional health check endpoints for specific services:

```typescript
// Example: Database-specific health check
export async function GET() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('published', true);
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({
        status: 'healthy',
        posts_count: data,
        database: 'connected'
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        error: error.message
      }),
      { status: 503 }
    );
  }
}
```

### Integration with External Monitoring

#### UptimeRobot Configuration
```
Monitor Type: HTTP(s)
Friendly Name: HanBin-Baik-Blog Health
URL: https://your-domain.com/api/health.json
Interval: 5 minutes
```

#### Grafana Dashboard
Create a dashboard with panels for:
- Health check status over time
- Response time trends
- Error rate tracking
- Uptime percentage

### Synthetic Monitoring

Set up browser-based monitoring to test:
- Page load times
- Interactive element responsiveness
- API endpoint availability
- User journey completion

## Security Considerations

### Access Control
- Health endpoints are public (no authentication required)
- Rate limiting may be needed for public endpoints
- Consider IP whitelisting for sensitive environments

### Data Exposure
- Avoid exposing sensitive information in health responses
- Don't include stack traces or internal paths
- Use generic error messages for public endpoints

### Rate Limiting
Consider adding rate limiting to health endpoints:

```typescript
// Example rate limiting middleware
const rateLimit = 100; // requests per minute
const windowMs = 60 * 1000;

const requestCounts = new Map<string, { count: number, lastReset: number }>();

export async function GET({ request }) {
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  const key = `health:${clientIp}`;
  
  const now = Date.now();
  const entry = requestCounts.get(key);
  
  if (entry && now - entry.lastReset < windowMs) {
    if (entry.count >= rateLimit) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429 }
      );
    }
    entry.count++;
  } else {
    requestCounts.set(key, { count: 1, lastReset: now });
  }
  
  // ... rest of health check logic
}
```

## Future Enhancements

### Planned Features

1. **Database Performance Monitoring**
   - Query execution time tracking
   - Connection pool monitoring
   - Query error rate analysis

2. **Real-time Alerting**
   - Webhook integration for alerts
   - Slack/Teams notifications
   - PagerDuty integration

3. **Historical Data Collection**
   - Time-series database integration
   - Trend analysis
   - Capacity planning

4. **Advanced Health Checks**
   - Specific endpoint monitoring
   - Content validation checks
   - Performance benchmarking

### Integration Opportunities

- **Sentry**: Error tracking integration
- **Plausible**: Real user monitoring
- **Datadog**: Comprehensive observability
- **New Relic**: Application performance monitoring

## Conclusion

The infrastructure monitoring and health check system provides comprehensive visibility into the HanBin-Baik-Blog service health. The implementation includes:

- ✅ Health check endpoints with detailed status
- ✅ GitHub Actions integration for automated monitoring
- ✅ Supabase connectivity verification
- ✅ System resource monitoring
- ✅ Uptime tracking and alerting
- ✅ Comprehensive documentation

This system ensures rapid detection of issues and provides the foundation for building a robust, reliable service.

---

**Maintained by**: hanbini96  
**Last Updated**: August 2025  
**Next Review**: September 2025