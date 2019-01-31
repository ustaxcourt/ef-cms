const {
  getCompletedWorkItemsForUser,
} = require('./getCompletedWorkItemsForUser.interactor');

describe('getCompletedWorkItemsForUser', () => {
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
      await getCompletedWorkItemsForUser({
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
        getCompletedWorkItemsForUser: () => [
          {
            workItemId: 'abc',
          },
        ],
      }),
      environment: { stage: 'local' },
    };

    const results = await getCompletedWorkItemsForUser({
      applicationContext,
    });

    expect(results).toEqual([{ workItemId: 'abc' }]);
  });
});
