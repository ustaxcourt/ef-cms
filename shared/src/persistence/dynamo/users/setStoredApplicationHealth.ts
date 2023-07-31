import * as client from '../../dynamodbClientService';

export type StoredApplicationHealth = {
  allChecksHealthy: boolean;
  timeStamp: number;
};

export const setStoredApplicationHealth = async (
  applicationContext: IApplicationContext,
  allChecksHealthy: boolean,
): Promise<void> => {
  await client.put({
    Item: {
      data: {
        allChecksHealthy,
        timeStamp: Date.now(),
      },
      pk: 'healthCheckValue',
      sk: 'healthCheckValue',
    },
    applicationContext,
  });
};
