import { Component } from 'react';

/**
 * ErrorBoundary component for React components in Astro
 * Catches errors in child components and displays fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by Error Boundary:', error, errorInfo);
    
    // Optionally send to error logging endpoint
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = async (error, errorInfo) => {
    try {
      // Try to send error to logging endpoint if available
      if (typeof window !== 'undefined') {
        await fetch('/api/log-error', {
          method: 'POST',
          body: JSON.stringify({
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString()
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (loggingError) {
      // Silently fail if logging endpoint is not available
      console.debug('Error logging failed, but error boundary handled the error:', loggingError);
    }
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="error-boundary bg-red-900/20 border border-red-700 rounded-lg p-4 mt-4">
          <h3 className="font-medium text-red-300 mb-2">Something went wrong</h3>
          <p className="text-red-200 text-sm mb-3">We're experiencing technical difficulties with this component.</p>
          <button
            className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
          <details className="mt-3 text-xs text-red-300">
            <summary className="cursor-pointer">Technical Details</summary>
            <pre className="mt-2 p-2 bg-red-800/30 rounded overflow-auto">
              {this.state.error?.message || 'No error message available'}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;