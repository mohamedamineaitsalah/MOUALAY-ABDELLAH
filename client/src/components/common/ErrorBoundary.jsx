import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6 text-sm max-w-md text-left bg-gray-100 p-4 rounded overflow-auto">
            <strong className="text-red-500">Error:</strong> {this.state.error?.toString()}<br/>
            {this.state.errorInfo && <span className="text-xs">{this.state.errorInfo.componentStack}</span>}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
