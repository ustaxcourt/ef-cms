import { recordError } from '@web-client/providers/realUserMonitoring';
import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Catches render-time errors thrown anywhere below it and renders a fallback
 * instead of unmounting the entire React tree (which leaves a blank page).
 *
 * Note: error boundaries do NOT catch errors in event handlers, asynchronous
 * code, or the boundary's own render - those still need their own handling.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Unhandled UI error caught by ErrorBoundary', error, info);
    recordError(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return (
        <div
          className="grid-container margin-top-5"
          data-testid="error-boundary-fallback"
        >
          <h1>Something went wrong</h1>
          <p>
            Please refresh the page. If the problem persists, contact support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
