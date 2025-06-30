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
