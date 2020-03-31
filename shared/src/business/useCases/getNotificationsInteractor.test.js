const { applicationContext } = require('../test/createTestApplicationContext');
const { getNotificationsInteractor } = require('./getNotificationsInteractor');

describe('getNotificationsInteractor', () => {
  it('returns an unread count for my messages', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'abc',
    });
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isQC: false,
          isRead: true,
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getInboxMessagesForUser.mockReturnValue([
        {
          isQC: false,
          isRead: false,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 1, qcUnreadCount: 0 });
  });

  it('returns an unread count for qc messages', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isQC: false,
          isRead: false,
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getInboxMessagesForUser.mockReturnValue([
        {
          isQC: true,
          isRead: true,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 0, qcUnreadCount: 1 });
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isQC: false,
          isRead: true,
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getInboxMessagesForUser.mockReturnValue([
        {
          isQC: false,
          isRead: true,
        },
      ]);
    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 0, qcUnreadCount: 0 });
  });
});
