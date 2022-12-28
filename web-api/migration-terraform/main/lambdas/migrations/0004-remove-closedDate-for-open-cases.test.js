import { migrateItems } from './0004-remove-closedDate-for-open-cases';
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem;
  let documentClient;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      hasSealedDocuments: true,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };
  });

  it('should return and not modify records that are NOT case records', async () => {
    const mockTrialSessionId = '87b86617-f090-4f26-a321-3ee0683cc0f2';
    const mockItems = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `trial-session|${mockTrialSessionId}`,
        sk: `trial-session|${mockTrialSessionId}`,
      },
    ];
    const results = await migrateItems(mockItems, documentClient);

    expect(results).toEqual(mockItems);
  });

  it('should set closedDate to undefined when the record is a case entity with a closedDate and a non-CLOSED_CASE_STATUSES status', async () => {
    const items = [mockCaseItem];

    const results = await migrateItems(items, documentClient);

    expect(results[0].closedDate).toBeUndefined();
  });
});
