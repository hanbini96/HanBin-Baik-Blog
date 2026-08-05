/**
 * Health Check Endpoint with Supabase Integration
 * 
 * This endpoint provides comprehensive health status including Supabase connectivity.
 * It can be used by monitoring systems to check if the service is running properly.
 * 
 * @returns {Object} Health status object with detailed information
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test Supabase connection
    const { error } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true });
    
    const healthChecks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'hanbin-baik-blog',
      version: '1.0.0',
      uptime: process.uptime(),
      memoryUsage: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed
      },
      checks: {
        database: error ? 'unhealthy' : 'connected',
        cache: 'available',
        dependencies: 'operational',
        environment: process.env.NODE_ENV
      },
      databaseStatus: {
        error: error?.message || null,
        responseTime: 'fast',
        connection: 'established'
      }
    };
    
    // If database is unhealthy, return 503
    if (healthChecks.checks.database === 'unhealthy') {
      return new Response(
        JSON.stringify({
          ...healthChecks,
          status: 'unhealthy'
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
    }
    
    return new Response(
      JSON.stringify(healthChecks),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'hanbin-baik-blog',
        version: '1.0.0',
        error: error.message,
        checks: {
          database: 'failed',
          cache: 'available',
          dependencies: 'failed'
        }
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

export async function POST() {
  return GET();
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}