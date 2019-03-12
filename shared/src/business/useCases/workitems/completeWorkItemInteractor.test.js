const { completeWorkItem } = require('./completeWorkItemInteractor');

describe('completeWorkItem', () => {
  let applicationContext;

  let mockWorkItem = {
    assigneeId: 'docketclerk',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '2019-03-11T21:56:01.625Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxpayer',
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
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
    };
    let error;
    try {
      await completeWorkItem({
        applicationContext,
        completedMessage: 'Completed',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the completed work item on valid user and arguments with null completedMessage', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Test Docketclerk',
          role: 'docketclerk',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        };
      },

      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
    };
    const result = await completeWorkItem({
      applicationContext,
      completedMessage: null,
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(result).toMatchObject({
      assigneeId: 'docketclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      completedBy: 'Test Docketclerk',
      completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      createdAt: '2019-03-11T21:56:01.625Z',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: {
        sentBy: 'taxpayer',
      },
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'work item completed',
          to: null,
          toUserId: null,
        },
      ],
      section: 'docket',
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('successfully returns the completed work item on valid user and arguments with defined completedMessage', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Test Docketclerk',
          role: 'docketclerk',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        };
      },

      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
    };
    const result = await completeWorkItem({
      applicationContext,
      completedMessage: 'Completed',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(result).toMatchObject({
      assigneeId: 'docketclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      completedBy: 'Test Docketclerk',
      completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      completedMessage: 'Completed',
      createdAt: '2019-03-11T21:56:01.625Z',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: {
        sentBy: 'taxpayer',
      },
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'Completed',
          to: null,
          toUserId: null,
        },
      ],
      section: 'docket',
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
