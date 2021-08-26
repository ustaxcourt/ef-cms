exports.sendNotificationToConnection = async ({
  applicationContext,
  connection,
  messageStringified,
}) => {
  const { connectionId, endpoint } = connection;

  const notificationClient = applicationContext.getNotificationClient({
    endpoint,
  });

  await notificationClient
    .postToConnection({
      ConnectionId: connectionId,
      Data: messageStringified,
    })
    .promise();
};
