import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false };
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error("Error caught:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Something went wrong. Please try again.</div>;
      }
      return this.props.children;
    }
  }

export default ErrorBoundary;