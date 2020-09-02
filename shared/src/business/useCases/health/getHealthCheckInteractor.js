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

/**
 * fixme
 *
 */
exports.getHealthCheckInteractor = async ({ applicationContext }) => {
  // elasticsearch
  const elasticSearchStatus = await getElasticSearchStatus({
    applicationContext,
  });

  const dynamoStatus = await getDynamoStatus({ applicationContext });
  const deployDynamoStatus = await getDeployDynamoStatus({
    applicationContext,
  });

  return {
    dynamo: {
      efcms: dynamoStatus,
      efcmsDeploy: deployDynamoStatus,
    },
    elasticsearch: elasticSearchStatus,
  };
};
