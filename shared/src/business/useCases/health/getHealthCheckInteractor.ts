const regionEast = 'us-east-1';
const regionWest = 'us-west-1';

const handleAxiosTimeout = axios => {
  let source = axios.CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, 1000);
  return source;
};

export const getElasticSearchStatus = async ({ applicationContext }) => {
  try {
    await applicationContext.getPersistenceGateway().getFirstSingleCaseRecord({
      applicationContext,
    });
  } catch (e) {
    applicationContext.logger.error('Elasticsearch health check failed. ', e);
    return false;
  }

  return true;
};

export const getDynamoStatus = async ({ applicationContext }) => {
  try {
    const dynamoStatus = await applicationContext
      .getPersistenceGateway()
      .getTableStatus({ applicationContext });
    return dynamoStatus === 'ACTIVE';
  } catch (e) {
    applicationContext.logger.error('Dynamo health check failed. ', e);
    return false;
  }
};

export const getDeployDynamoStatus = async ({ applicationContext }) => {
  try {
    const deployDynamoStatus = await applicationContext
      .getPersistenceGateway()
      .getDeployTableStatus({ applicationContext });
    return deployDynamoStatus === 'ACTIVE';
  } catch (e) {
    applicationContext.logger.error('Dynamo deploy health check failed. ', e);
    return false;
  }
};

export const getDynamsoftStatus = async ({ applicationContext }) => {
  const axios = applicationContext.getHttpClient();

  const source = handleAxiosTimeout(axios);

  try {
    const scannerResourceUri = applicationContext.getScannerResourceUri();
    await Promise.all(
      [
        `${scannerResourceUri}/dynamsoft.webtwain.initiate.js`,
        `${scannerResourceUri}/dynamsoft.webtwain.config.js`,
        `${scannerResourceUri}/dynamsoft.webtwain.install.js`,
        `${scannerResourceUri}/src/dynamsoft.webtwain.css`,
      ].map(url => {
        return axios.get(url, { cancelToken: source.token, timeout: 1000 });
      }),
    );
    return true;
  } catch (e) {
    applicationContext.logger.error('Dynamsoft health check failed. ', e);
    return false;
  }
};

export const checkS3BucketsStatus = async ({
  applicationContext,
  bucketName,
}) => {
  try {
    await applicationContext
      .getStorageClient()
      .listObjectsV2({
        Bucket: bucketName,
        MaxKeys: 1,
      })
      .promise();

    return true;
  } catch (e) {
    applicationContext.logger.error('S3 health check failed. ', e);
    return false;
  }
};

export const getS3BucketStatus = async ({ applicationContext }) => {
  const efcmsDomain = process.env.EFCMS_DOMAIN;
  const currentColor = process.env.CURRENT_COLOR;
  const eastS3BucketName = `${efcmsDomain}-documents-${applicationContext.environment.stage}-${regionEast}`;
  const westS3BucketName = `${efcmsDomain}-documents-${applicationContext.environment.stage}-${regionWest}`;
  const eastS3TempBucketName = `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-${regionEast}`;
  const westS3TempBucketName = `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-${regionWest}`;
  const eastS3QuarantineBucketName = `${efcmsDomain}-quarantine-${applicationContext.environment.stage}-${regionEast}`;
  const westS3QuarantineBucketName = `${efcmsDomain}-quarantine-${applicationContext.environment.stage}-${regionWest}`;
  const appS3Bucket = `app-${currentColor}.${efcmsDomain}`;
  const publicS3Bucket = `${currentColor}.${efcmsDomain}`;
  const publicFailoverS3Bucket = `failover-${currentColor}.${efcmsDomain}`;
  const appFailoverS3Bucket = `app-failover-${currentColor}.${efcmsDomain}`;

  const s3Buckets = {
    app: appS3Bucket,
    appFailover: appFailoverS3Bucket,
    eastDocuments: eastS3BucketName,
    eastQuarantine: eastS3QuarantineBucketName,
    eastTempDocuments: eastS3TempBucketName,
    public: publicS3Bucket,
    publicFailover: publicFailoverS3Bucket,
    westDocuments: westS3BucketName,
    westQuarantine: westS3QuarantineBucketName,
    westTempDocuments: westS3TempBucketName,
  };

  let bucketStatus = {};

  for (const [key, value] of Object.entries(s3Buckets)) {
    bucketStatus[key] = await checkS3BucketsStatus({
      applicationContext,
      bucketName: value,
    });
  }

  return bucketStatus;
};

export const getCognitoStatus = async ({ applicationContext }) => {
  const axios = applicationContext.getHttpClient();

  const source = handleAxiosTimeout(axios);

  try {
    const clientId = await applicationContext
      .getPersistenceGateway()
      .getClientId({
        applicationContext,
        userPoolId: process.env.USER_POOL_ID,
      });

    await axios.get(
      `https://auth-${process.env.STAGE}-${process.env.COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=${clientId}&redirect_uri=https%3A//app.${process.env.EFCMS_DOMAIN}/log-in`,
      {
        cancelToken: source.token,
        timeout: 1000,
      },
    );
    return true;
  } catch (e) {
    applicationContext.logger.error('Cognito health check failed. ', e);
    return false;
  }
};

export const getEmailServiceStatus = async ({ applicationContext }) => {
  try {
    return await applicationContext
      .getPersistenceGateway()
      .getSesStatus({ applicationContext });
  } catch (e) {
    applicationContext.logger.error('Email service health check failed. ', e);
    return false;
  }
};

export const getHealthCheckInteractor = async (
  applicationContext: IApplicationContext,
) => {
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
  return {
    cognito: cognitoStatus,
    dynamo: {
      efcms: dynamoStatus,
      efcmsDeploy: deployDynamoStatus,
    },
    dynamsoft: dynamsoftStatus,
    elasticsearch: elasticSearchStatus,
    emailService: emailServiceStatus,
    s3: s3BucketStatus,
  };
};
