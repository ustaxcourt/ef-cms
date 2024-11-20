import { retrySendNotificationToConnections } from '@web-api/notifications/retrySendNotificationToConnections';
import { saveRequestResponse } from '@web-api/persistence/dynamo/polling/saveRequestResponse';
import { sendNotificationToConnection } from '@web-api/notifications/sendNotificationToConnection';
import { sendNotificationToUser } from '@web-api/notifications/sendNotificationToUser';

export const getNotificationGateway = () => ({
  retrySendNotificationToConnections,
  saveRequestResponse,
  sendNotificationToConnection,
  sendNotificationToUser,
});
