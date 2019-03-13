const { updateWorkItem } = require('./updateWorkItemInteractor');

describe('updateWorkItem', () => {
  let applicationContext;

  let mockWorkItem = {
    assigneeId: 'docketclerk',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
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
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        saveWorkItem: async () => null,
      }),
    };
    let error;
    try {
      await updateWorkItem({
        applicationContext,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItemToUpdate: mockWorkItem,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the workItemToUpdate is null', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'docketclerk',
          userId: 'docketclerk',
        };
      },
      getPersistenceGateway: () => ({
        saveWorkItem: async () => null,
      }),
    };
    let error;
    try {
      await updateWorkItem({
        applicationContext,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItemToUpdate: null,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the workItemToUpdate.workItemId does not match the workItemId', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'docketclerk',
          userId: 'docketclerk',
        };
      },
      getPersistenceGateway: () => ({
        saveWorkItem: async () => null,
      }),
    };
    let error;
    try {
      await updateWorkItem({
        applicationContext,
        userId: 'docketclerk',
        workItemId: 'x54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItemToUpdate: mockWorkItem,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the new updated work item on valid user and arguments', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'docketclerk',
          userId: 'docketclerk',
        };
      },

      getPersistenceGateway: () => ({
        getUserById: () => {
          return {
            name: 'Test Docketclerk',
            role: 'docketclerk',
            userId: 'docketclerk',
          };
        },
        saveWorkItem: async () => mockWorkItem,
      }),
    };
    const result = await updateWorkItem({
      applicationContext,
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      workItemToUpdate: mockWorkItem,
    });
    expect(result).toMatchObject({
      assigneeId: 'docketclerk',
      assigneeName: 'Test Docketclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'taxpayer' },
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
