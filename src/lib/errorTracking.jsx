/**
 * Error tracking utilities for the Astro + Supabase blog platform
 * Provides global error handling and error boundary setup
 */

import ErrorBoundary from '../components/ErrorBoundary';

/**
 * Sets up global error handlers for the application
 */
export function setupErrorTracking() {
  if (typeof window === 'undefined') return;

  // Global error handler
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error:', {
      message,
      source,
      lineno,
      colno,
      error: error?.message,
      stack: error?.stack
    });
    return true; // Prevent default browser error handling
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Rejection:', {
      reason: event.reason?.message || event.reason,
      stack: event.reason?.stack
    });
  });

  // Log uncaught errors to console
  window.addEventListener('error', function(event) {
    console.error('Uncaught Error:', event.error);
  });
}

/**
 * Logs an error to the error tracking service
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context about the error
 */
export async function logError(error, context = {}) {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/log-error', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (loggingError) {
    // Silently fail if logging endpoint is not available
    console.debug('Error logging failed:', loggingError.message);
  }
}

/**
 * Creates a wrapped version of a React component with error boundary
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.ComponentType} Wrapped component with error boundary
 */
export function withErrorBoundary(Component) {
  return function ErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Error tracking setup for Astro integration
 */
export function initErrorTracking() {
  setupErrorTracking();
  
  // Log initial page load
  console.log('Error tracking initialized');
}