import { StoredApplicationHealth } from './setStoredApplicationHealth';
import { getFromDeployTable } from '../../dynamodbClientService';

export const getStoredApplicationHealth = async (
  applicationContext: IApplicationContext,
  region: string,
): Promise<StoredApplicationHealth> => {
  const result = await getFromDeployTable({
    Key: {
      pk: 'healthCheckValue',
      sk: `healthCheckValue|${region}`,
    },
    applicationContext,
  });
  return result?.data;
};
