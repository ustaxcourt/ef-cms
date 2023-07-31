import * as client from '../../dynamodbClientService';
import { StoredApplicationHealth } from './setStoredApplicationHealth';

export const getStoredApplicationHealth = async (
  applicationContext: IApplicationContext,
): Promise<StoredApplicationHealth> => {
  const result = await client.get({
    Key: {
      pk: 'healthCheckValue',
      sk: 'healthCheckValue',
    },
    applicationContext,
  });
  return result?.data;
};
