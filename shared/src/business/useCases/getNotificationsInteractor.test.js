const { getNotificationsInteractor } = require('./getNotificationsInteractor');

describe('getNotificationsInteractor', () => {
  let applicationContext;

  it('returns an unread count for my messages', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({
        getDocumentQCInboxForUser: () => [
          {
            isInternal: true,
            isRead: true,
          },
        ],
        getInboxMessagesForUser: () => [
          {
            isInternal: true,
            isRead: false,
          },
        ],
      }),
    };
    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 1, qcUnreadCount: 0 });
  });

  it('returns an unread count for qc messages', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({
        getDocumentQCInboxForUser: () => [
          {
            isInternal: true,
            isRead: false,
          },
        ],
        getInboxMessagesForUser: () => [
          {
            isInternal: false,
            isRead: true,
          },
        ],
      }),
    };
    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 0, qcUnreadCount: 1 });
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({
        getDocumentQCInboxForUser: () => [
          {
            isInternal: true,
            isRead: true,
          },
        ],
        getInboxMessagesForUser: () => [
          {
            isInternal: true,
            isRead: true,
          },
        ],
      }),
    };
    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 0, qcUnreadCount: 0 });
  });
});
