const { getNotifications } = require('./getNotificationsInteractor');

describe('getWorkItemsForUser', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    document: {
      sentBy: 'taxyaper',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('returns an unread count', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getPersistenceGateway: () => ({
        getReadMessagesForUser: async () => [],
        getWorkItemsForUser: async () => [],
      }),
      getUseCases: () => ({
        getWorkItemsForUser: () => {
          return [mockWorkItem];
        },
      }),
    };
    const result = await getNotifications({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ unreadCount: 1 });
  });
});
