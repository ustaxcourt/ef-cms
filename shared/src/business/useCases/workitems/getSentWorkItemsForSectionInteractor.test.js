const {
  getSentWorkItemsForSection,
} = require('./getSentWorkItemsForSectionInteractor');

describe('getSentWorkItemsForSection', () => {
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
      await getSentWorkItemsForSection({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized for getting sent work items');
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
        getSentWorkItemsForSection: () => [
          {
            workItemId: 'abc',
          },
        ],
      }),
    };

    const results = await getSentWorkItemsForSection({
      applicationContext,
    });

    expect(results).toEqual([{ workItemId: 'abc' }]);
  });
});
