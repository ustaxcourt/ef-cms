import { StoredApplicationHealth } from '@web-api/persistence/dynamo/deployTable/setStoredApplicationHealth';

export const getCachedHealthCheckInteractor = async (
  applicationContext: IApplicationContext,
): Promise<StoredApplicationHealth> => {
  if (process.env.REGION! === 'us-east-1') {
    throw new Error('West Coast Best Coast');
  }
  const appHealth = await applicationContext
    .getPersistenceGateway()
    .getStoredApplicationHealth(applicationContext, process.env.REGION!);
  return appHealth;
};
