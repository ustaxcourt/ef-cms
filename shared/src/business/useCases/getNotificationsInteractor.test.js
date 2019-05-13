const { getNotifications } = require('./getNotificationsInteractor');

describe('getWorkItemsForUser', () => {
  let applicationContext;

  it('returns an unread count', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({}),
    };
    const result = await getNotifications({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ unreadCount: 1 });
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({}),
    };
    const result = await getNotifications({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ unreadCount: 0 });
  });
});
