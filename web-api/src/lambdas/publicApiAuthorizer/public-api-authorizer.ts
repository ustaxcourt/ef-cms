import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

const getWhiteListIps = async () => {
  const [IPS_RECORD] = await getFeatureFlagValues(['allowed-terminal-ips']);
  return IPS_RECORD ? (IPS_RECORD.value.current as string[]) : [];
};

export const createAuthorizer = ({ getWhiteListIpsFunction }) => {
  return async event => {
    const ips = await getWhiteListIpsFunction();

    const policy = {
      context: {
        isTerminalUser: ips.includes(event.requestContext.identity.sourceIp),
      },
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn.split('/').slice(0, 2).join('/') + '/*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: event.requestContext.identity.sourceIp,
    };

    return policy;
  };
};

export const handler = createAuthorizer({
  getWhiteListIpsFunction: getWhiteListIps,
});
