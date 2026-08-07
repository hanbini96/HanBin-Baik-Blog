/**
 * API endpoint for logging errors from the frontend
 * This is a simple logging endpoint that writes errors to the console
 * In a production environment, you might want to store these in a database
 */
export async function post({ request }) {
  try {
    const { error, stack, context, timestamp, userAgent } = await request.json();

    console.error('ERROR LOG:', {
      error,
      stack: stack?.split('\n').slice(0, 5).join('\n'), // Limit stack trace length
      context,
      timestamp,
      userAgent
    });

    return new Response(JSON.stringify({ success: true, id: Date.now() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error logging endpoint failed:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function get() {
  return new Response(JSON.stringify({ message: 'Error logging endpoint' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}