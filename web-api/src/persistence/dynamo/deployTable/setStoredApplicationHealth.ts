import { putInDeployTable } from '../../dynamodbClientService';

export type StoredApplicationHealth = {
  allChecksHealthy: boolean;
  timeStamp: number;
};

export const setStoredApplicationHealth = async (
  applicationContext: IApplicationContext,
  { allChecksHealthy, region }: { allChecksHealthy: boolean; region: string },
): Promise<void> => {
  await putInDeployTable(applicationContext, {
    data: {
      allChecksHealthy,
      timeStamp: Date.now(),
    },
    pk: 'healthCheckValue',
    sk: `healthCheckValue|${region}`,
  });
};
