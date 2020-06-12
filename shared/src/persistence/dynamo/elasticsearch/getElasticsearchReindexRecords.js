const client = require('../../dynamodbClientService');

/**
 * getElasticsearchReindexRecords
 *
 * @param {object} arguments deconstructed arguments
 * @param {object} arguments.applicationContext the application context
 * @returns {Promise} resolved with query results
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
