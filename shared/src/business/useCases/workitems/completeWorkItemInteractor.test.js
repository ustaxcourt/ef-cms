const { completeWorkItemInteractor } = require('./completeWorkItemInteractor');
const { User } = require('../../entities/User');

describe('completeWorkItemInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    assigneeId: 'docketclerk',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '2019-03-11T21:56:01.625Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('throws an error if the user does not have access to the interactor', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Petitioner',
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
      }),
    };
    let error;
    try {
      await completeWorkItemInteractor({
        applicationContext,
        completedMessage: 'Completed',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
