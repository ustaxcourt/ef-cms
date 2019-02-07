const { getWorkItems } = require('./getWorkItems.interactor');
const User = require('../../entities/User');

describe('getWorkItems', () => {
  let applicationContext;

  let mockWorkItem = {
    createdAt: '',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    messages: [],
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    sentBy: 'docketclerk',
    section: 'docket',
    docketNumber: '101-18',
    document: {
      sentBy: 'taxyaper',
    },
  };

  it('throws an error if the user does not have access to the interactor', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({ userId: 'taxpayer' });
      },
      getPersistenceGateway: () => ({
        getWorkItemsForUser: async () => null,
      }),
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getWorkItems({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('returns an empty array if no work items are returned', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({ userId: 'petitionsclerk' });
      },
      getPersistenceGateway: () => ({
        getWorkItemsForUser: async () => null,
      }),
      environment: { stage: 'local' },
    };
    const result = await getWorkItems({
      userId: 'docketclerk',
      applicationContext,
    });
    expect(result).toEqual([]);
  });

  it('validates and returns the work items', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({ userId: 'petitionsclerk' });
      },
      getPersistenceGateway: () => ({
        getWorkItemsForUser: async () => [mockWorkItem],
      }),
      environment: { stage: 'local' },
    };
    const result = await getWorkItems({
      userId: 'docketclerk',
      applicationContext,
    });
    expect(result).toMatchObject([mockWorkItem]);
  });
});
