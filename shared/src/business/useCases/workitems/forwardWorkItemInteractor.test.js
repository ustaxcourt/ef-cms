const { forwardWorkItemInteractor } = require('./forwardWorkItemInteractor');

describe('forwardWorkItemInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxpayer',
    },
    messages: [],
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Tax Payer',
        role: 'petitioner',
        userId: 'taxpayer',
      }),
      getPersistenceGateway: () => ({
        getUserById: () => {
          return { userId: 'docketclerk' };
        },
        getWorkItemById: async () => mockWorkItem,
      }),
    };
    let error;
    try {
      await forwardWorkItemInteractor({
        applicationContext,
        assigneeId: 'docketclerk',
        message: 'success',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
