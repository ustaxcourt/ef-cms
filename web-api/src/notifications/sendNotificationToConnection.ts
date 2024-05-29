import { ServerApplicationContext } from '@web-api/applicationContext';

export type Connection = {
  connectionId: string;
  endpoint: string;
  pk: string;
  sk: string;
};

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
  applicationContext: ServerApplicationContext;
  connection: Connection;
  messageStringified: string;
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
