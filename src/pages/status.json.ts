/**
 * Static Status Page for GitHub Pages
 * 
 * This endpoint provides static status information that gets built with the site.
 * It shows the last build status and can be used by monitoring services.
 * 
 * Note: This is a static file that gets generated during build time.
 * It won't show real-time status but indicates the last successful build.
 * 
 * @returns {Object} Static status information
 */
export async function GET() {
  // This is a static file - the content is generated at build time
  // The actual status will be set during build via environment variables
  
  const status = {
    status: 'operational',
    last_build: process.env.LAST_BUILD || 'unknown',
    last_commit: process.env.LAST_COMMIT || 'unknown',
    build_timestamp: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
    monitoring: {
      uptime_robot: 'https://stats.uptimerobot.com/...',
      github_actions: 'https://github.com/hanbini96/HanBin-Baik-Blog/actions'
    },
    documentation: {
      monitoring_guide: '/stabilization/INFRASTRUCTURE_MONITORING.html'
    }
  };

  return new Response(
    JSON.stringify(status, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    }
  );
}

export async function POST() {
  return GET();
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=300'
    }
  });
}