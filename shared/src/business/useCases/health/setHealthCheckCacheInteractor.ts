export const setHealthCheckCacheInteractor = async (
  applicationContext: IApplicationContext,
) => {
  // intentionally leaving these here for testing
  console.log('setHealthCheckCacheInteractor 1', Date.now());

  const { cognito, dynamo, dynamsoft, elasticsearch, emailService, s3 } =
    await applicationContext
      .getUseCases()
      .getHealthCheckInteractor(applicationContext);

  const allChecksHealthy = [
    ...Object.values(s3),
    ...Object.values(dynamo),
    cognito,
    dynamsoft,
    elasticsearch,
    emailService,
  ].every(status => {
    return status === true;
  });

  const region = process.env.REGION!;
  await applicationContext
    .getPersistenceGateway()
    .setStoredApplicationHealth(applicationContext, {
      allChecksHealthy,
      region,
    });

  console.log('setHealthCheckCacheInteractor 2', Date.now());
};
