jest.mock('@aws-sdk/client-ssm', () => {
  return {
    SSMClient: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
  };
});

import { getSsmClient } from './getSsmClient';

describe('getSsmClient', () => {
  it('should return an SSMClient instance', () => {
    const client = getSsmClient();
    expect(client).toBeDefined();
  });

  it('should return the same cached instance on subsequent calls', () => {
    const client1 = getSsmClient();
    const client2 = getSsmClient();
    expect(client1).toBe(client2);
  });
});
