import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const notificationTableDefinition = {
  id: DEFAULT as number | undefined,
  topic: DEFAULT as string,
  ttl: DEFAULT as number,
};

export type NotificationTable = typeof notificationTableDefinition;

export const DW_NOTIFICATION_COLUMNS = Object.keys(
  notificationTableDefinition,
) as Array<keyof NotificationTable>;

export type NotificationKysely = Selectable<NotificationTable>;
export type NewNotificationKysely = Insertable<NotificationTable>;
export type UpdateNotificationKysely = Updateable<NotificationTable>;
