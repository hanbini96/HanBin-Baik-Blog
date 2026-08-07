import { useState } from 'react';

/**
 * Test component that intentionally throws errors to test error boundaries
 */
export default function TestErrorComponent() {
  const [errorCount, setErrorCount] = useState(0);
  
  const throwError = () => {
    setErrorCount(prev => prev + 1);
    throw new Error(`Test error #${errorCount + 1}`);
  };
  
  const throwAsyncError = async () => {
    setErrorCount(prev => prev + 1);
    throw new Error(`Async test error #${errorCount + 1}`);
  };

  return (
    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mt-4">
      <h3 className="font-medium text-red-300 mb-2">Error Boundary Test Component</h3>
      <p className="text-red-200 text-sm mb-3">This component intentionally throws errors to test the error boundary functionality.</p>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={throwError}
          className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-sm transition-colors"
        >
          Throw Sync Error
        </button>
        
        <button
          onClick={throwAsyncError}
          className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-sm transition-colors"
        >
          Throw Async Error
        </button>
      </div>
      
      <p className="text-red-300 text-sm">Error count: {errorCount}</p>
      
      <p className="text-red-400 text-xs mt-2">
        If error boundaries are working, these errors will be caught and displayed with a user-friendly message instead of crashing the entire page.
      </p>
    </div>
  );
}