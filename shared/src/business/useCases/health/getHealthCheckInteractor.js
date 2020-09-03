const regionEast = 'us-east-1';
const regionWest = 'us-west-1';

const getElasticSearchStatus = async ({ applicationContext }) => {
  try {
    await applicationContext.getPersistenceGateway().getFirstSingleCaseRecord({
      applicationContext,
    });
  } catch (e) {
    return false;
  }

  return true;
};

const getDynamoStatus = async ({ applicationContext }) => {
  try {
    const status = await applicationContext
      .getPersistenceGateway()
      .getTableStatus({ applicationContext });
    return status === 'ACTIVE';
  } catch (e) {
    return false;
  }
};

const getDeployDynamoStatus = async ({ applicationContext }) => {
  try {
    const status = await applicationContext
      .getPersistenceGateway()
      .getDeployTableStatus({ applicationContext });
    return status === 'ACTIVE';
  } catch (e) {
    return false;
  }
};
const handleAxiosTimeout = axios => {
  let source = axios.CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, 1000);
  return source;
};

const getDynamsoftStatus = async ({ applicationContext }) => {
  const axios = applicationContext.getHttpClient();

  const source = handleAxiosTimeout(axios);

  try {
    const efcmsDomain = process.env.EFCMS_DOMAIN;
    await Promise.all(
      [
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.initiate.js`,
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.config.js`,
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.install.js`,
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.css`,
      ].map(url => {
        return axios.get(url, { cancelToken: source.token, timeout: 1000 });
      }),
    );
    return true;
  } catch (e) {
    return false;
  }
};

const checkS3BucketsStatus = async ({ applicationContext, bucketName }) => {
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
    return false;
  }
};

const getS3BucketStatus = async ({ applicationContext }) => {
  const efcmsDomain = process.env.EFCMS_DOMAIN;
  const eastS3BucketName = `${efcmsDomain}-documents-${applicationContext.environment.stage}-${regionEast}`;
  const westS3BucketName = `${efcmsDomain}-documents-${applicationContext.environment.stage}-${regionWest}`;
  const eastS3TempBucketName = `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-${regionEast}`;
  const westS3TempBucketName = `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-${regionWest}`;
  const appS3Bucket = `app.${efcmsDomain}`;
  const publicS3Bucket = `${efcmsDomain}`;
  const publicFailoverS3Bucket = `failover.${efcmsDomain}`;
  const appFailoverS3Bucket = `app-failover.${efcmsDomain}`;

  const s3Buckets = [
    eastS3BucketName,
    westS3BucketName,
    eastS3TempBucketName,
    westS3TempBucketName,
    appS3Bucket,
    publicS3Bucket,
    publicFailoverS3Bucket,
    appFailoverS3Bucket,
  ];

  let bucketStatus = {};

  for (const bucket of s3Buckets) {
    bucketStatus[bucket] = await checkS3BucketsStatus({
      applicationContext,
      bucketName: bucket,
    });
  }

  return bucketStatus;
};

const getCognitoStatus = async ({ applicationContext }) => {
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
      `https://${process.env.COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=${clientId}&redirect_uri=https%3A//app.${process.env.EFCMS_DOMAIN}/log-in`,
      {
        cancelToken: source.token,
        timeout: 1000,
      },
    );
    return true;
  } catch (e) {
    return false;
  }
};

const getEmailServiceStatus = async ({ applicationContext }) => {
  try {
    return await applicationContext.getPersistenceGateway().getSesStatus();
  } catch (e) {
    return false;
  }
};

const getClamAVStatus = async () => {
  // eslint-disable-next-line spellcheck/spell-checker
  // TODO - implement once #6282 (Implement ClamAV Fargate Solution) has been completed
  return false;
};

/**
 * getHealthCheckInteractor
 *
 * @param {object} providers.applicationContext the application context
 * @returns {object} contains the status of all our different services
 */
exports.getHealthCheckInteractor = async ({ applicationContext }) => {
  const elasticSearchStatus = await getElasticSearchStatus({
    applicationContext,
  });

  const dynamoStatus = await getDynamoStatus({ applicationContext });
  const deployDynamoStatus = await getDeployDynamoStatus({
    applicationContext,
  });

  const dynamsoftStatus = await getDynamsoftStatus({ applicationContext });

  const s3BucketStatus = await getS3BucketStatus({ applicationContext });

  const cognitoStatus = await getCognitoStatus({ applicationContext });

  const emailServiceStatus = await getEmailServiceStatus({
    applicationContext,
  });

  const clamAVStatus = await getClamAVStatus({
    applicationContext,
  });

  return {
    clamAV: clamAVStatus,
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
