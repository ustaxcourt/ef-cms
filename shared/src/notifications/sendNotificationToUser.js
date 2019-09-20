const client = require('../persistence/dynamodbClientService');

exports.sendNotificationToUser = async ({
  applicationContext,
  message,
  userId,
}) => {
  const notificationClient = applicationContext.getNotificationClient();

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

  console.log('userId', userId);
  console.log('connections', connections);

  for (const connection of connections) {
    try {
      await notificationClient
        .postToConnection({
          ConnectionId: connection.sk,
          Data: JSON.stringify(message),
        })
        .promise();
    } catch (err) {
      console.log('err', err);
      if (err.statusCode === 410) {
        await client
          .delete({
            applicationContext,
            key: {
              pk: connection.pk,
              sk: connection.sk,
            },
          })
          .promise();
      }
    }
  }
};
