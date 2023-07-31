import {
  getCognitoStatus,
  getDeployDynamoStatus,
  getDynamoStatus,
  getDynamsoftStatus,
  getElasticSearchStatus,
  getEmailServiceStatus,
  getS3BucketStatus,
} from './getHealthCheckInteractor';

export const getHealthCheckAndSetCache = async (
  applicationContext: IApplicationContext,
) => {
  console.log('getHealthCheckAndSetCache 1', Date.now());
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

  await applicationContext
    .getPersistenceGateway()
    .setStoredApplicationHealth(applicationContext, allChecksHealthy);

  console.log('getHealthCheckAndSetCache 2', Date.now());
};
