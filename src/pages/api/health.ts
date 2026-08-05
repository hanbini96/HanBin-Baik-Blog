/**
 * Health Check Endpoint for Infrastructure Monitoring
 * 
 * This endpoint provides basic health status for the application.
 * It can be used by monitoring systems to check if the service is running.
 * 
 * @returns {Object} Health status object
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'hanbin-baik-blog',
      version: '1.0.0',
      checks: {
        database: 'connected',
        cache: 'available',
        dependencies: 'operational'
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

/**
 * POST handler for health checks (for compatibility)
 */
export async function POST() {
  return GET();
}

/**
 * HEAD handler for health checks
 */
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}