import { BatchClient } from '@aws-sdk/client-batch';

const batchClients: { [key: string]: BatchClient } = {};

export function getBatchClient(region: 'us-east-1' | 'us-west-1') {
  if (batchClients[region]) return batchClients[region];
  batchClients[region] = new BatchClient({ region });
  return batchClients[region];
}
