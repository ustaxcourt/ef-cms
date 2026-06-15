import {
  DEPLOYMENT_TIMESTAMP_STORAGE_KEY,
  EXPOSED_RESPONSE_HEADERS,
  X_DEPLOYMENT_TIMESTAMP,
  X_FORCE_REFRESH,
  X_MANUAL_REFRESH_REQUIRED,
  X_TERMINAL_USER,
  getHeaderValue,
} from './headers';

describe('headers', () => {
  describe('constants', () => {
    it('exports the expected header name constants', () => {
      expect(DEPLOYMENT_TIMESTAMP_STORAGE_KEY).toEqual('deploymentTimestamp');
      expect(X_DEPLOYMENT_TIMESTAMP).toEqual('X-Deployment-Timestamp');
      expect(X_FORCE_REFRESH).toEqual('X-Force-Refresh');
      expect(X_MANUAL_REFRESH_REQUIRED).toEqual('X-Manual-Refresh-Required');
      expect(X_TERMINAL_USER).toEqual('X-Terminal-User');
    });

    it('EXPOSED_RESPONSE_HEADERS contains all four expected headers', () => {
      expect(EXPOSED_RESPONSE_HEADERS).toEqual([
        X_DEPLOYMENT_TIMESTAMP,
        X_FORCE_REFRESH,
        X_MANUAL_REFRESH_REQUIRED,
        X_TERMINAL_USER,
      ]);
    });
  });

  describe('getHeaderValue', () => {
    it('returns undefined when headers is undefined', () => {
      expect(getHeaderValue(undefined, 'X-Foo')).toBeUndefined();
    });

    it('returns the value using headers.get() when available (exact case)', () => {
      const headers = { get: jest.fn().mockReturnValue('bar') };
      expect(getHeaderValue(headers, 'X-Foo')).toEqual('bar');
    });

    it('falls back to lowercase lookup when headers.get() returns falsy for exact case', () => {
      const headers = {
        get: jest.fn().mockImplementation((name: string) => {
          return name === 'x-foo' ? 'bar' : undefined;
        }),
      };
      expect(getHeaderValue(headers, 'X-Foo')).toEqual('bar');
    });

    it('returns undefined when headers.get() returns a non-string value', () => {
      const headers: Record<string, unknown> = {
        get: jest.fn().mockReturnValue(null),
        'X-Foo': 123,
      };
      expect(getHeaderValue(headers, 'X-Foo')).toBeUndefined();
    });

    it('returns the value from plain object headers by exact key', () => {
      const headers = { 'X-Foo': 'baz' };
      expect(getHeaderValue(headers, 'X-Foo')).toEqual('baz');
    });

    it('returns the value from plain object headers by lowercase key', () => {
      const headers = { 'x-foo': 'qux' };
      expect(getHeaderValue(headers, 'X-Foo')).toEqual('qux');
    });

    it('returns undefined when the header is not present', () => {
      expect(getHeaderValue({ 'X-Other': 'val' }, 'X-Foo')).toBeUndefined();
    });

    it('returns undefined when the header value is not a string', () => {
      const headers: Record<string, unknown> = { 'X-Foo': 42 };
      expect(getHeaderValue(headers, 'X-Foo')).toBeUndefined();
    });
  });
});
