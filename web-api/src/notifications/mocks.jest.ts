import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/notifications/sendNotificationToUser', () =>
  mockFactory('sendNotificationToUser'),
);

jest.mock('@web-api/notifications/retrySendNotificationToConnection', () =>
  mockFactory('retrySendNotificationToConnection'),
);

jest.mock('@web-api/notifications/sendNotificationToConnection', () =>
  mockFactory('sendNotificationToConnection'),
);
