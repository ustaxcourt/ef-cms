const {
  getSentWorkItemsForUser,
} = require('./getSentWorkItemsForUserInteractor');

describe('getSentWorkItemsForUser', () => {
  it('throws an unauthorization error if the user does not have access to the WORKITEMS', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Tax Payer',
        role: 'petitioner',
        userId: 'taxpayer',
      }),
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
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Tax Payer',
        role: 'petitionsclerk',
        userId: 'petitionsclerk',
      }),
      getPersistenceGateway: () => ({
        getSentWorkItemsForUser: () => [
          {
            workItemId: 'abc',
          },
        ],
      }),
    };

    const results = await getSentWorkItemsForUser({
      applicationContext,
    });

    expect(results).toEqual([{ workItemId: 'abc' }]);
  });
});
