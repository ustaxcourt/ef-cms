const { getWorkItemsForUser } = require('./getWorkItemsForUserInteractor');
const User = require('../../entities/User');

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

  it('throws an error if the user does not have access to the interactor', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({ role: 'petitioner', userId: 'taxpayer' });
      },
      getPersistenceGateway: () => ({
        getWorkItemsForUser: async () => null,
      }),
    };
    let error;
    try {
      await getWorkItemsForUser({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('returns an empty array if no work items are returned', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({ role: 'petitionsclerk', userId: 'petitionsclerk' });
      },
      getPersistenceGateway: () => ({
        getWorkItemsForUser: async () => null,
      }),
    };
    const result = await getWorkItemsForUser({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual([]);
  });

  it('validates and returns the work items', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({ role: 'petitionsclerk', userId: 'petitionsclerk' });
      },
      getPersistenceGateway: () => ({
        getWorkItemsForUser: async () => [mockWorkItem],
      }),
    };
    const result = await getWorkItemsForUser({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toMatchObject([mockWorkItem]);
  });
});
