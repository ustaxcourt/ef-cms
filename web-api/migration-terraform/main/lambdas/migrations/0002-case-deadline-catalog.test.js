const { migrateItems } = require('./0002-case-deadline-catalog');

describe('migrateItems', () => {
  let documentClient;
  const CASE_DEADLINE_ID = '31db3d83-23c2-4726-bff6-aaf61b7ce1b6';

  const mockCaseDeadline = {
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
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

  it('should not modify records that are not case deadline catalog records', async () => {
    const items = [
      {
        gsi1pk:
          'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
      },
      { gsi1pk: 'eligible-for-trial-case-catalog|123-20' },
      { pk: 'case|123-20' },
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

  it('should return modified case deadline catalog records', async () => {
    const items = [
      {
        caseDeadlineId: CASE_DEADLINE_ID,
        pk: 'case-deadline-catalog',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toMatchObject([
      {
        caseDeadlineId: CASE_DEADLINE_ID,
        gsi1pk: 'case-deadline-catalog',
        pk: mockCaseDeadline.deadlineDate,
        sk: `case-deadline-catalog|${CASE_DEADLINE_ID}`,
      },
    ]);
  });

  it('should not modify case deadline catalog records if a full case deadline is not found', async () => {
    documentClient = {
      get: () => ({
        promise: async () => ({}),
      }),
    };

    const items = [
      {
        caseDeadlineId: CASE_DEADLINE_ID,
        pk: 'case-deadline-catalog',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        caseDeadlineId: CASE_DEADLINE_ID,
        pk: 'case-deadline-catalog',
      },
    ]);
  });
});
