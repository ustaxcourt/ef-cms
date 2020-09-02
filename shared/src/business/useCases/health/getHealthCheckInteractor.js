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

  return { elasticsearch: elasticSearchStatus };
};
