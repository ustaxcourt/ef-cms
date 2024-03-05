/**
 * sendNotificationToConnection
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.connection the connection to send the message to
 * @param {string} providers.messageStringified the message
 */
export const sendNotificationToConnection = async ({
  applicationContext,
  connection,
  messageStringified,
}: {
  applicationContext: IApplicationContext;
  connection: TConnection;
  messageStringified: string;
}) => {
  const { connectionId, endpoint } = connection;

  const notificationClient = applicationContext.getNotificationClient({
    endpoint,
  });

  console.log(
    'sending notification to ',
    connection.endpoint,
    connection.connectionId,
  );

  await notificationClient
    .postToConnection({
      ConnectionId: connectionId,
      Data: messageStringified,
    })
    .promise();
};
