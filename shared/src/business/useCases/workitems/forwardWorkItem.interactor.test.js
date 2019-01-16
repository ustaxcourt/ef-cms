const { forwardWorkItem } = require('./forwardWorkItem.interactor');

describe('forwardWorkItem', () => {
  let applicationContext;

  let mockWorkItem = {
    createdAt: '',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    messages: [],
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    sentBy: 'docketclerk',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxyaper',
    },
  };

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
      getCurrentUser: () => ({
        userId: 'taxpayer',
        name: 'Tax Payer',
      }),
      environment: { stage: 'local' },
    };
    let error;
    try {
      await forwardWorkItem({
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        assigneeId: 'docketclerk',
        message: 'success',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('attempts to save the expected workItem', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
      getCurrentUser: () => ({
        userId: 'docketclerk',
        name: 'Docket Clerk',
      }),
      environment: { stage: 'local' },
    };
    const result = await forwardWorkItem({
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      assigneeId: 'docketclerk',
      message: 'success',
      applicationContext,
    });
    expect(result).toMatchObject({
      assigneeId: 'docketclerk',
      assigneeName: 'Test Docketclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'taxyaper' },
      messages: [
        {
          message: 'success',
          sentBy: 'Docket Clerk',
          sentTo: 'Test Docketclerk',
          userId: 'docketclerk',
        },
      ],
      section: 'docket',
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
