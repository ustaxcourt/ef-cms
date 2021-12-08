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
  const connection = await client.get({
    Key: {
      pk: `connection|${connectionId}`,
      sk: `connection|${connectionId}`,
    },
    applicationContext,
  });

  if (!connection) {
    // it must have expired
    return;
  }

  const toDelete = [connection];

  const userConnection = await client.get({
    Key: {
      pk: `user|${connection.userId}`,
      sk: `connection|${connection.connectionId}`,
    },
    applicationContext,
  });

  if (userConnection) {
    toDelete.push(userConnection);
  }

  await client.batchDelete({
    applicationContext,
    items: toDelete,
  });
};
