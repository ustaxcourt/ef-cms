export const setHealthCheckCacheInteractor = async (
  applicationContext: IApplicationContext,
) => {
  // The scope of how we consider the application to be "healthy" will grow.
  // Currently we consider an application region to be "healthy" if a web request can be made to API Gateway, and the lambda can retrieve the stored application health from Dynamo
  const allChecksHealthy = true;

  const region = process.env.REGION!;
  await applicationContext
    .getPersistenceGateway()
    .setStoredApplicationHealth(applicationContext, {
      allChecksHealthy,
      region,
    });
};
