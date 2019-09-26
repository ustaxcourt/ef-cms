const client = require('../persistence/dynamodbClientService');

/**
 * sendNotificationToUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message
 * @param {string} providers.userId the id of the user
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

  for (const connection of connections) {
    try {
      const { endpoint } = connection;

      const notificationClient = applicationContext.getNotificationClient({
        endpoint,
      });

      await notificationClient
        .postToConnection({
          ConnectionId: connection.sk,
          Data: JSON.stringify(message),
        })
        .promise();
    } catch (err) {
      if (err.statusCode === 410) {
        await client.delete({
          applicationContext,
          key: {
            pk: connection.pk,
            sk: connection.sk,
          },
        });
      }
    }
  }
};
