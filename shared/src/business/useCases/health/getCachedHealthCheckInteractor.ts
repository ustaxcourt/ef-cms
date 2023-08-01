import { StoredApplicationHealth } from '../../../persistence/dynamo/deployTable/setStoredApplicationHealth';

export const getCachedHealthCheckInteractor = async (
  applicationContext: IApplicationContext,
): Promise<StoredApplicationHealth> => {
  console.log('getCachedHealthCheckInteractor 1: ', process.env.REGION);
  const appHealth = await applicationContext
    .getPersistenceGateway()
    .getStoredApplicationHealth(applicationContext, process.env.REGION!);
  console.log('getCachedHealthCheckInteractor 2', appHealth);
  return appHealth;
};
