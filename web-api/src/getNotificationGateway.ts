/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
import { retrySendNotificationToConnections } from '@shared/notifications/retrySendNotificationToConnections';
import { sendNotificationToConnection } from '@shared/notifications/sendNotificationToConnection';
import { sendNotificationToUser } from '@shared/notifications/sendNotificationToUser';

const notificationGateway = {
  retrySendNotificationToConnections,
  sendNotificationToConnection,
  sendNotificationToUser,
};

export const getNotificationGateway = () => notificationGateway;

type _IGetNotificationGateway = typeof getNotificationGateway;

declare global {
  interface IGetNotificationGateway extends _IGetNotificationGateway {}
}
