const { migrateItems } = require('./0001-eligible-for-trial-case-id');

describe('migrateItems', () => {
  it('should filter out item if the item.gsi1pk is an eligible for trial catalog record with a caseId as the case identifier', async () => {
    const items = [
      {
        gsi1pk:
          'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
      },
      { gsi1pk: 'eligible-for-trial-case-catalog|123-20' },
      { pk: 'case|123-20' },
    ];

    const results = migrateItems(items);

    expect(results).toMatchObject([
      { gsi1pk: 'eligible-for-trial-case-catalog|123-20' },
      { pk: 'case|123-20' },
    ]);
  });
});
