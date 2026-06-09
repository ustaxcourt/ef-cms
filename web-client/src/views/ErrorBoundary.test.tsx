import { ErrorBoundary } from './ErrorBoundary';
import { recordError } from '@web-client/providers/realUserMonitoring';
import React from 'react';

jest.mock('@web-client/providers/realUserMonitoring', () => ({
  recordError: jest.fn(),
}));

describe('ErrorBoundary', () => {
  it('flags an error in state via getDerivedStateFromError', () => {
    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({
      hasError: true,
    });
  });

  it('renders its children when no error has occurred', () => {
    const children = <div data-testid="child" />;
    const boundary = new ErrorBoundary({ children });

    expect(boundary.render()).toBe(children);
  });

  it('renders the default fallback when an error has occurred', () => {
    const boundary = new ErrorBoundary({ children: <div /> });
    boundary.state = { hasError: true };

    const rendered = boundary.render() as React.ReactElement<{
      'data-testid': string;
    }>;

    expect(rendered.props['data-testid']).toEqual('error-boundary-fallback');
  });

  it('renders a custom fallback when provided', () => {
    const fallback = <div data-testid="custom-fallback" />;
    const boundary = new ErrorBoundary({ children: <div />, fallback });
    boundary.state = { hasError: true };

    expect(boundary.render()).toBe(fallback);
  });

  it('logs the error and reports it to RUM in componentDidCatch', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const boundary = new ErrorBoundary({ children: <div /> });
    const error = new Error('boom');
    const info = { componentStack: 'at SomeComponent' } as React.ErrorInfo;

    boundary.componentDidCatch(error, info);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unhandled UI error caught by ErrorBoundary',
      error,
      info,
    );
    expect(recordError).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});
