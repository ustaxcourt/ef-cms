const { getWorkItemInteractor } = require('./getWorkItemInteractor');
const { User } = require('../../entities/User');

describe('getWorkItemInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    isQC: true,
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('throws an error if the work item was not found', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => ({
        getWorkItemById: async () => null,
      }),
    };
    let error;
    try {
      await getWorkItemInteractor({
        applicationContext,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
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
      await getWorkItemInteractor({
        applicationContext,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the work item for a docketclerk', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.docketClerk,
          userId: 'docketclerk',
        };
      },
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
      }),
    };
    const result = await getWorkItemInteractor({
      applicationContext,
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(result).toMatchObject({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'petitioner' },
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
