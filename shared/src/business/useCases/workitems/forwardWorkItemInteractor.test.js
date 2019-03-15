const { forwardWorkItem } = require('./forwardWorkItemInteractor');

describe('forwardWorkItem', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxyaper',
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
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
    };
    let error;
    try {
      await forwardWorkItem({
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

  it('attempts to save the expected workItem', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Docket Clerk',
        role: 'docketclerk',
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
      getPersistenceGateway: () => ({
        getUserById: () => {
          return {
            name: 'Test Docketclerk',
            role: 'docketclerk',
            userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          };
        },
        getWorkItemById: async () => mockWorkItem,
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
    };
    const result = await forwardWorkItem({
      applicationContext,
      assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'success',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(result).toMatchObject({
      assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Docketclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'taxyaper' },
      messages: [
        {
          from: 'Docket Clerk',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'success',
          to: 'Test Docketclerk',
        },
      ],
      section: 'docket',
      sentBy: 'Docket Clerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
