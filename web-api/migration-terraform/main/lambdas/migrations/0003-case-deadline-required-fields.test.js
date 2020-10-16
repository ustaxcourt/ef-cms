const { migrateItems } = require('./0003-case-deadline-required-fields');

describe('migrateItems', () => {
  let documentClient;
  const CASE_DEADLINE_ID = '31db3d83-23c2-4726-bff6-aaf61b7ce1b6';

  const mockCaseDeadline = {
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
    pk: `case-deadline|${CASE_DEADLINE_ID}`,
    sk: `case-deadline|${CASE_DEADLINE_ID}`,
  };

  beforeEach(() => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Item: mockCaseDeadline,
        }),
      }),
    };
  });

  it('should not modify records that are not case deadline records', async () => {
    const items = [
      {
        gsi1pk:
          'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'eligible-for-trial-case-catalog',
      },
      {
        gsi1pk: 'eligible-for-trial-case-catalog|123-20',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'eligible-for-trial-case-catalog',
      },
      {
        pk: 'case|123-20',
        sk: 'case-deadline|40235366-99a9-42af-a59e-bf8bc4e64715',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toMatchObject([
      {
        gsi1pk:
          'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
      },
      { gsi1pk: 'eligible-for-trial-case-catalog|123-20' },
      { pk: 'case|123-20' },
    ]);
  });

  it('should return modified case deadline records with sortableDocketNumber set', async () => {
    const items = [mockCaseDeadline];

    const results = await migrateItems(items, documentClient);

    expect(results).toMatchObject([
      {
        ...mockCaseDeadline,
        sortableDocketNumber: 20000123,
      },
    ]);
  });
});
