// src/components/common/ErrorBoundary.jsx
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Component Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 p-4 text-red-600">
          Component crashed. Check console.
        </div>
      );
    }
    return this.props.children;
  }
}