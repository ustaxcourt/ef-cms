const client = require('../../dynamodbClientService');

/**
 * deleteUserConnection
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.connectionId the websocket connection id
 * @returns {Promise} the promise of the call to persistence
 */
exports.deleteUserConnection = async ({ applicationContext, connectionId }) => {
  /**
   * Only one record should be found at most.
   * You can't delete for a gsi,
   * So a query is needed to gather pk/sk
   */
  const connections = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': connectionId,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  for (const connection of connections) {
    await client.delete({
      applicationContext,
      key: {
        pk: connection.pk,
        sk: connection.sk,
      },
    });
  }
};
