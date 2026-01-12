import { SSMClient } from '@aws-sdk/client-ssm';

let ssmClientCache: SSMClient;

export const getSsmClient = (): SSMClient => {
  if (ssmClientCache) return ssmClientCache;
  ssmClientCache = new SSMClient({ region: 'us-east-1' });
  return ssmClientCache;
};
