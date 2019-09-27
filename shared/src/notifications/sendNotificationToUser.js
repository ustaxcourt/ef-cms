const client = require('../persistence/dynamodbClientService');

/**
 * sendNotificationToUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message
 * @param {string} providers.userId the id of the user
 * @returns {Promise} upon completion of notification delivery
 */
exports.sendNotificationToUser = async ({
  applicationContext,
  message,
  userId,
}) => {
  const connections = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `connections-${userId}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const messageStringified = JSON.stringify(message);

  const sendNotificationToConnection = connection => {
    let result;
    try {
      const { endpoint } = connection;

      const notificationClient = applicationContext.getNotificationClient({
        endpoint,
      });

      result = notificationClient
        .postToConnection({
          ConnectionId: connection.sk,
          Data: messageStringified,
        })
        .promise();
    } catch (err) {
      if (err.statusCode === 410) {
        result = client.delete({
          applicationContext,
          key: {
            pk: connection.pk,
            sk: connection.sk,
          },
        });
      }
      // TODO: what if error doesn't conform to the above?
    }
    return result;
  };

  return Promise.all(connections.map(sendNotificationToConnection));
};
