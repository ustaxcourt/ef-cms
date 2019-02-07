const {
  getSentWorkItemsForUser,
} = require('./getSentWorkItemsForUser.interactor');

describe('getSentWorkItemsForUser', () => {
  it('throws an unauthorization error if the user does not have access to the WORKITEMS', async () => {
    const applicationContext = {
      getCurrentUser: () => ({
        userId: 'taxpayer',
        name: 'Tax Payer',
      }),
      environment: { stage: 'local' },
    };

    let error;
    try {
      await getSentWorkItemsForUser({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('returns the work items that is returned from the persistence', async () => {
    const applicationContext = {
      getCurrentUser: () => ({
        userId: 'petitionsclerk',
        name: 'Tax Payer',
      }),
      getPersistenceGateway: () => ({
        getSentWorkItemsForUser: () => [
          {
            workItemId: 'abc',
          },
        ],
      }),
      environment: { stage: 'local' },
    };

    const results = await getSentWorkItemsForUser({
      applicationContext,
    });

    expect(results).toEqual([{ workItemId: 'abc' }]);
  });
});
