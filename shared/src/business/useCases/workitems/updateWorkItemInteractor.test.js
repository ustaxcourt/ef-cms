const { updateWorkItem } = require('./updateWorkItemInteractor');

describe('updateWorkItem', () => {
  let applicationContext;

  let mockWorkItem = {
    createdAt: '',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    messages: [],
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    sentBy: 'docketclerk',
    assigneeId: 'docketclerk',
    section: 'docket',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxpayer',
    },
  };

  it('throws an error if the user does not have access to the interactor', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        saveWorkItem: async () => null,
      }),
      getCurrentUser: () => {
        return {
          userId: 'taxpayer',
          role: 'petitioner',
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateWorkItem({
        workItemToUpdate: mockWorkItem,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the workItemToUpdate is null', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        saveWorkItem: async () => null,
      }),
      getCurrentUser: () => {
        return {
          userId: 'docketclerk',
          role: 'docketclerk',
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateWorkItem({
        workItemToUpdate: null,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the workItemToUpdate.workItemId does not match the workItemId', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        saveWorkItem: async () => null,
      }),
      getCurrentUser: () => {
        return {
          userId: 'docketclerk',
          role: 'docketclerk',
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateWorkItem({
        userId: 'docketclerk',
        workItemToUpdate: mockWorkItem,
        workItemId: 'x54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the new updated work item on valid user and arguments', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        saveWorkItem: async () => mockWorkItem,
        getUserById: () => {
          return {
            userId: 'docketclerk',
            role: 'docketclerk',
            name: 'Test Docketclerk',
          };
        },
      }),
      getCurrentUser: () => {
        return {
          userId: 'docketclerk',
          role: 'docketclerk',
        };
      },

      environment: { stage: 'local' },
    };
    const result = await updateWorkItem({
      workItemToUpdate: mockWorkItem,
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      applicationContext,
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
