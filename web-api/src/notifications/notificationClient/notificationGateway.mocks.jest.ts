const mockNotificationGateway = {
  retrySendNotificationToConnections: jest.fn(() =>
    console.debug('search was not implemented, using default mock'),
  ),
  saveRequestResponse: jest.fn(() =>
    console.debug('search was not implemented, using default mock'),
  ),
  sendNotificationToConnection: jest.fn(() =>
    console.debug('search was not implemented, using default mock'),
  ),
  sendNotificationToUser: jest.fn(() =>
    console.debug('search was not implemented, using default mock'),
  ),
};

jest.mock(
  '@web-api/notifications/notificationClient/getNotificationGateway',
  () => ({
    getNotificationGateway: () => mockNotificationGateway,
  }),
);
