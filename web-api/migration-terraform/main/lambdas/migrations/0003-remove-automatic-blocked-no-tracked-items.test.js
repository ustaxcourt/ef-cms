const {
  AUTOMATIC_BLOCKED_REASONS,
  UNSERVABLE_EVENT_CODES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  migrateItems,
} = require('./0003-remove-automatic-blocked-no-tracked-items');
const {
  MOCK_DOCUMENTS,
} = require('../../../../../shared/src/test/mockDocuments');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem;
  let documentClient;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      automaticBlocked: true,
      automaticBlockedDate: '2020-03-01T00:00:00.000Z',
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
      docketEntries: [],
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
      trialDate: '2020-03-01T00:00:00.000Z',
    };

    documentClient = {
      get: jest.fn().mockReturnValue({
        promise: async () => ({
          Item: [],
        }),
      }),
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

  it('should update automaticBlocked fields when the record is a case entity with a trial date and no pending items or case deadlines', async () => {
    const items = [mockCaseItem];

    const results = await migrateItems(items, documentClient);

    expect(results[0].automaticBlocked).toBeFalsy();
    expect(results[0].automaticBlockedDate).toBeUndefined();
    expect(results[0].automaticBlockedReason).toBeUndefined();
  });

  it('should NOT update automaticBlocked fields when the record is a case entity, with a trial date, that has case deadlines', async () => {
    const items = [mockCaseItem];
    documentClient = {
      get: jest.fn().mockReturnValue({
        promise: async () => ({
          Item: ['a deadline'],
        }),
      }),
    };

    const results = await migrateItems(items, documentClient);

    expect(results[0].automaticBlocked).toBeTruthy();
    expect(results[0].automaticBlockedDate).toBeDefined();
    expect(results[0].automaticBlockedReason).toBeDefined();
  });

  it('should NOT update automaticBlocked fields when the record is a case entity, with a trial date, but has a served pending item', async () => {
    const items = [
      {
        ...mockCaseItem,
        docketEntries: [
          {
            ...MOCK_DOCUMENTS[0],
            pending: true,
            servedAt: '2020-03-01T00:00:00.000Z',
          },
        ],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].automaticBlocked).toBeTruthy();
    expect(results[0].automaticBlockedDate).toBeDefined();
    expect(results[0].automaticBlockedReason).toBeDefined();
  });

  it('should NOT update automaticBlocked fields when the record is a case entity, with a trial date, but has an unservable pending item', async () => {
    const items = [
      {
        ...mockCaseItem,
        docketEntries: [
          {
            ...MOCK_DOCUMENTS[0],
            eventCode: UNSERVABLE_EVENT_CODES[0],
            pending: true,
          },
        ],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].automaticBlocked).toBeTruthy();
    expect(results[0].automaticBlockedDate).toBeDefined();
    expect(results[0].automaticBlockedReason).toBeDefined();
  });
});
