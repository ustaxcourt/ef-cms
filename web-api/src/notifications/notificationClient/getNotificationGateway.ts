import { retrySendNotificationToConnections } from '@web-api/notifications/retrySendNotificationToConnections';
import { sendNotificationToConnection } from '@web-api/notifications/sendNotificationToConnection';
import { sendNotificationToUser } from '@web-api/notifications/sendNotificationToUser';
import { saveRequestResponse } from '@web-api/persistence/postgres/polling/saveRequestResponse';

export const getNotificationGateway = () => ({
  retrySendNotificationToConnections,
  saveRequestResponse,
  sendNotificationToConnection,
  sendNotificationToUser,
});
