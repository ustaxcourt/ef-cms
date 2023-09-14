import { StoredApplicationHealth } from '@web-api/persistence/dynamo/deployTable/setStoredApplicationHealth';

export const getCachedHealthCheckInteractor = async (
  applicationContext: IApplicationContext,
): Promise<StoredApplicationHealth> => {
  const appHealth = await applicationContext
    .getPersistenceGateway()
    .getStoredApplicationHealth(applicationContext, process.env.REGION!);
  return appHealth;
};
