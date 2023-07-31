import { StoredApplicationHealth } from './setStoredApplicationHealth';
import { getFromDeployTable } from '../../dynamodbClientService';

export const getStoredApplicationHealth = async (
  applicationContext: IApplicationContext,
): Promise<StoredApplicationHealth> => {
  const result = await getFromDeployTable({
    Key: {
      pk: 'healthCheckValue',
      sk: 'healthCheckValue',
    },
    applicationContext,
  });
  return result?.data;
};
