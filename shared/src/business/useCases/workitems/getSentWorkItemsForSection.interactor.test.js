const {
  getSentWorkItemsForSection,
} = require('./getSentWorkItemsForSection.interactor');

describe('getSentWorkItemsForSection', () => {
  it('throws an unauthorization error if the user does not have access to the WORKITEMS', async () => {
    const applicationContext = {
      getCurrentUser: () => ({
        userId: 'taxpayer',
        role: 'petitioner',
        name: 'Tax Payer',
      }),
      environment: { stage: 'local' },
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
    expect(error.message).toEqual(
      'Unauthorized for getting completed work items',
    );
  });

  it('returns the work items that is returned from the persistence', async () => {
    const applicationContext = {
      getCurrentUser: () => ({
        userId: 'petitionsclerk',
        role: 'petitionsclerk',
        name: 'Tax Payer',
      }),
      getPersistenceGateway: () => ({
        getSentWorkItemsForSection: () => [
          {
            workItemId: 'abc',
          },
        ],
      }),
      environment: { stage: 'local' },
    };

    const results = await getSentWorkItemsForSection({
      applicationContext,
    });

    expect(results).toEqual([{ workItemId: 'abc' }]);
  });
});
