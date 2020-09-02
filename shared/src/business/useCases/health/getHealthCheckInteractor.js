const {
  describeDeployTable,
  describeTable,
} = require('../../../persistence/dynamodbClientService');
const { search } = require('../../../persistence/elasticsearch/searchClient');

const getElasticSearchStatus = async ({ applicationContext }) => {
  try {
    await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: ['docketNumber'],
          query: {
            match_all: {},
          },
          size: 1,
        },
        index: 'efcms-case',
      },
    });
  } catch (e) {
    return false;
  }

  return true;
};

const getDynamoStatus = async ({ applicationContext }) => {
  try {
    const { Table } = await describeTable({ applicationContext });
    return Table.TableStatus === 'ACTIVE';
  } catch (e) {
    return false;
  }
};

const getDeployDynamoStatus = async ({ applicationContext }) => {
  try {
    const { Table } = await describeDeployTable({ applicationContext });
    return Table.TableStatus === 'ACTIVE';
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

  let source = handleAxiosTimeout(axios);

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

const getS3DocumentsBucketStatus = async ({ applicationContext }) => {
  const documentsBucketParams = {
    Bucket: applicationContext.environment.documentsBucketName,
    MaxKeys: 1,
  };

  try {
    await applicationContext
      .getStorageClient()
      .listObjects(documentsBucketParams)
      .promise();
    return true;
  } catch (e) {
    return false;
  }
};

const getS3TempDocumentsBucketStatus = async ({ applicationContext }) => {
  const tempDocumentsBucketParams = {
    Bucket: applicationContext.environment.tempDocumentsBucketName,
    MaxKeys: 1,
  };

  try {
    await applicationContext
      .getStorageClient()
      .listObjects(tempDocumentsBucketParams)
      .promise();
    return true;
  } catch (e) {
    return false;
  }
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

  const s3DocumentsBucketStatus = await getS3DocumentsBucketStatus({
    applicationContext,
  });
  const s3TempDocumentsBucketStatus = await getS3TempDocumentsBucketStatus({
    applicationContext,
  });

  return {
    dynamo: {
      efcms: dynamoStatus,
      efcmsDeploy: deployDynamoStatus,
    },
    dynamsoft: dynamsoftStatus,
    elasticsearch: elasticSearchStatus,
    s3DocumentsBucket: s3DocumentsBucketStatus,
    s3TempDocumentsBucket: s3TempDocumentsBucketStatus,
  };
};
