const { migrateItems } = require('./0006-reformat-sortable-docket-number');
const { MOCK_CASE } = require('../../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem;
  let documentClient;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      docketNumber: '1050-20',
      hasSealedDocuments: true,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
      sortableDocketNumber: 20001050,
    };
  });

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ]);
  });

  it('should adjust the sortableDocketNumber property only when the record is a case entity', async () => {
    const items = [mockCaseItem];

    const results = await migrateItems(items, documentClient);

    expect(results[0].sortableDocketNumber).toBe(2020001050);
  });
});
