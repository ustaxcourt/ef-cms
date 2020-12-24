const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  migrateItems,
} = require('./0009-remove-blocked-cases-from-eligible-for-trial-record');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Items: [],
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT eligible for trial case catalog records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and not modify records that are eligible for trial case catalog records that are neither blocked nor automaticBlocked', async () => {
    const mockNonBlockedCase = {
      docketNumber: MOCK_CASE.docketNumber,
      pk: 'eligible-for-trial-case-catalog',
    };

    const items = [mockNonBlockedCase];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          ...MOCK_CASE,
          associatedJudge: 'Judge Dredd',
          automaticBlocked: false,
          blocked: false,
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'A reason',
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([expect.objectContaining(mockNonBlockedCase)]),
    );
  });

  it('should not migrate eligible for trial records that are associated with a case that was not found', async () => {
    const mockNonBlockedCase = {
      docketNumber: MOCK_CASE.docketNumber,
      pk: 'eligible-for-trial-case-catalog',
    };

    const items = [mockNonBlockedCase];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {},
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
  });

  it('should NOT return records that are eligible for trial case catalog records that are blocked', async () => {
    const mockNonBlockedCase = {
      docketNumber: MOCK_CASE.docketNumber,
      pk: 'eligible-for-trial-case-catalog',
    };

    const items = [mockNonBlockedCase];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          ...MOCK_CASE,
          associatedJudge: 'Judge Dredd',
          blocked: true,
          blockedDate: '2019-03-01T21:42:29.073Z',
          blockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'A reason',
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
  });

  it('should NOT migrate eligible for trial case catalog records which belong to a cases that are calendered', async () => {
    const mockNonBlockedCase = {
      docketNumber: MOCK_CASE.docketNumber,
      pk: 'eligible-for-trial-case-catalog',
    };

    const items = [mockNonBlockedCase];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          ...MOCK_CASE,
          associatedJudge: 'Judge Dredd',
          blocked: false,
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'A reason',
          status: CASE_STATUS_TYPES.calendared,
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
  });

  it('should NOT return records that are eligible for trial case catalog records that are automaticBlocked', async () => {
    const mockNonBlockedCase = {
      docketNumber: MOCK_CASE.docketNumber,
      pk: 'eligible-for-trial-case-catalog',
    };

    const items = [mockNonBlockedCase];

    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          ...MOCK_CASE,
          associatedJudge: 'Judge Dredd',
          automaticBlocked: true,
          automaticBlockedDate: '2019-03-01T21:42:29.073Z',
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'A reason',
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
  });
});
