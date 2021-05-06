const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

const { migrateItems } = require('./9999-fake-migration');

describe('migrateItems', () => {
  it('should return and not modify records that are NOT cases', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: 'not processed yet',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: 'not processed yet',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should add migrated prop to itemwhen the item is a case record', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].migrated).toBeDefined();
  });
});
