const client = require('../../dynamodbClientService');

/**
 * getElasticsearchReindexRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 */
exports.getElasticsearchReindexRecords = async ({ applicationContext }) => {
  return await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': 'elasticsearch-reindex',
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });
};
