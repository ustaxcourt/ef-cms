import { SSMClient } from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: 'us-east-1' });
export const getSsmClient = (): SSMClient => {
  return ssmClient;
};
