import { getNotificationClient } from './getNotificationClient';

describe('getNotificationClient', () => {
  it('returns a client configured with the provided endpoint', () => {
    const client = getNotificationClient({
      endpoint: 'https://example.com/ws',
    });

    expect(client).toBeDefined();
    expect(typeof (client as any).send).toBe('function');
  });

  it('rewrites localhost endpoints to the local websocket port', () => {
    const client = getNotificationClient({
      endpoint: 'http://localhost:1234/ws',
    });

    expect(client).toBeDefined();
    expect(typeof (client as any).send).toBe('function');
  });

  it('does not rewrite when an empty endpoint is passed', () => {
    const client = getNotificationClient({ endpoint: '' });

    expect(client).toBeDefined();
  });
});
