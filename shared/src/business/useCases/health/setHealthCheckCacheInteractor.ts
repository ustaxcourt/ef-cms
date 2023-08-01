import {
  getCognitoStatus,
  getDeployDynamoStatus,
  getDynamoStatus,
  getDynamsoftStatus,
  getElasticSearchStatus,
  getEmailServiceStatus,
  getS3BucketStatus,
} from './getHealthCheckInteractor';

export const setHealthCheckCacheInteractor = async (
  applicationContext: IApplicationContext,
) => {
  console.log('setHealthCheckCacheInteractor 1', Date.now());
  const [
    elasticSearchStatus,
    dynamoStatus,
    deployDynamoStatus,
    dynamsoftStatus,
    s3BucketStatus,
    cognitoStatus,
    emailServiceStatus,
  ] = await Promise.all([
    getElasticSearchStatus({
      applicationContext,
    }),
    getDynamoStatus({ applicationContext }),
    getDeployDynamoStatus({
      applicationContext,
    }),
    getDynamsoftStatus({ applicationContext }),
    getS3BucketStatus({ applicationContext }),
    getCognitoStatus({ applicationContext }),
    getEmailServiceStatus({
      applicationContext,
    }),
  ]);

  const allChecksHealthy = [
    ...Object.values(s3BucketStatus),
    elasticSearchStatus,
    dynamoStatus,
    deployDynamoStatus,
    dynamsoftStatus,
    cognitoStatus,
    emailServiceStatus,
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
