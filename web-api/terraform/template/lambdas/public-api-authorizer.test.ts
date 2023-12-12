import { createAuthorizer } from './public-api-authorizer';

describe('public-api-authorizer', () => {
  it('should set isTerminalUser to true when the users ip is found in the whitelist', async () => {
    const policy = await createAuthorizer({
      getWhiteListIpsFunction: () => ['192.168.0.1'],
    })({
      methodArn: 'abc/123/eee',
      requestContext: {
        identity: {
          sourceIp: '192.168.0.1',
        },
      },
    });
    expect(policy.context.isTerminalUser).toBeTruthy();
  });

  it('should set isTerminalUser to false when the users ip is NOT found in the whitelist', async () => {
    const policy = await createAuthorizer({
      getWhiteListIpsFunction: () => ['192.168.0.1'],
    })({
      methodArn: 'abc/123/eee',
      requestContext: {
        identity: {
          sourceIp: '127.0.0.1',
        },
      },
    });
    expect(policy.context.isTerminalUser).toBeFalsy();
  });
});
