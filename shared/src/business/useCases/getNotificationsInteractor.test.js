const { applicationContext } = require('../test/createTestApplicationContext');
const { getNotificationsInteractor } = require('./getNotificationsInteractor');
const { ROLES } = require('../entities/EntityConstants');

describe('getNotificationsInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserInboxMessages.mockReturnValue([
        {
          isRead: true,
          messageId: 'message-id-1',
        },
      ]);
    applicationContext
      .getPersistenceGateway()
      .getSectionInboxMessages.mockReturnValue([
        {
          messageId: 'message-id-1',
        },
      ]);

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      role: ROLES.docketClerk,
      section: 'docket',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    });

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    });
  });

  it('fails due to being unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    });

    await expect(
      getNotificationsInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized to get inbox counts');
  });

  it('returns an unread count for my messages', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isRead: true,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({
      qcUnreadCount: 0,
      unreadMessageCount: 0,
      userInboxCount: 1,
      userSectionCount: 1,
    });
  });

  it('returns an unread count for qc messages', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isRead: false,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({
      qcUnreadCount: 1,
      unreadMessageCount: 0,
      userInboxCount: 1,
      userSectionCount: 1,
    });
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isRead: true,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result).toEqual({
      qcUnreadCount: 0,
      unreadMessageCount: 0,
      userInboxCount: 1,
      userSectionCount: 1,
    });
  });

  it('returns an accurate unread count for my messages', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserInboxMessages.mockReturnValue([
        {
          isRead: false,
          messageId: 'message-id-1',
        },
        {
          isRead: true,
          messageId: 'message-id-2',
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result).toEqual({
      qcUnreadCount: 0,
      unreadMessageCount: 1,
      userInboxCount: 2,
      userSectionCount: 1,
    });
  });
});
