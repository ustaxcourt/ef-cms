const {
  AUTOMATIC_BLOCKED_REASONS,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0004-standing-pretrial-order-signatures');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: [],
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT a case', async () => {
    const items = [
      {
        gsi1pk:
          'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'eligible-for-trial-case-catalog',
      },
      {
        pk: 'case|123-20',
        sk: 'case|123-20',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          gsi1pk:
            'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
          pk: 'eligible-for-trial-case-catalog',
          sk: 'eligible-for-trial-case-catalog',
        },
        {
          pk: 'case|123-20',
          sk: 'case|123-20',
        },
      ]),
    );
  });

  it('should return and not modify case records that have a trial date', async () => {
    const mockDocketEntry = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `docket-entry|${MOCK_CASE.docketNumber}`,
      ...MOCK_CASE.docketEntries[0],
    };

    const results = await migrateItems([mockDocketEntry], documentClient);

    expect(results).toEqual([mockDocketEntry]);
  });

  it('should return and not modify case records that do not have any docket entries that are both pending and isLegacyServed', async () => {
    const mockDocketEntry = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `docket-entry|${MOCK_CASE.docketNumber}`,
      ...MOCK_CASE.docketEntries[0],
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
      signedAt: '2020-07-06T17:06:04.552Z',
      signedByUserId: 'f3de692c-0979-4023-a4af-ec36abe3ce60',
      signedJudgeName: 'Michael Scott',
    };

    const results = await migrateItems([mockDocketEntry], documentClient);

    expect(results).toEqual([mockDocketEntry]);
  });

  it('should set automaticBlocked and automaticBlockedDate on case records that have at least one docket entry where pending and isLegacyServed are true', async () => {
    const MOCK_TRIAL = {
      judge: {
        name: 'Michael Scott',
        userId: 'da64ccd0-1d2b-4e2c-889c-3b01aeaed702',
      },
      maxCases: 100,
      sessionType: 'Regular',
      startDate: '2025-12-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2025',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '3f20a89b-56eb-4f06-9faf-2184cb479330',
    };

    documentClient.get = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Item: { ...MOCK_CASE, trialSessionId: MOCK_TRIAL.trialSessionId },
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Item: MOCK_TRIAL,
        }),
      });

    const mockDocketEntry = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `docket-entry|${MOCK_CASE.docketNumber}`,
      ...MOCK_CASE.docketEntries[0],
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
      signedAt: '2020-07-06T17:06:04.552Z',
    };

    const results = await migrateItems([mockDocketEntry], documentClient);

    expect(results).toMatchObject([
      {
        ...mockDocketEntry,
        signedByUserId: MOCK_TRIAL.judge.userId,
        signedJudgeName: MOCK_TRIAL.judge.name,
      },
    ]);
  });

  describe('automaticBlockedReason', () => {
    it('should be pendingAndDueDate when the case record is already blocked for dueDate', async () => {
      const MOCK_TRIAL = {
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-12-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
        trialSessionId: '3f20a89b-56eb-4f06-9faf-2184cb479330',
      };

      documentClient.get = jest
        .fn()
        .mockReturnValueOnce({
          promise: async () => ({
            Item: { ...MOCK_CASE, trialSessionId: MOCK_TRIAL.trialSessionId },
          }),
        })
        .mockReturnValueOnce({
          promise: async () => ({
            Item: MOCK_TRIAL,
          }),
        });

      const mockDocketEntry = {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `docket-entry|${MOCK_CASE.docketNumber}`,
        ...MOCK_CASE.docketEntries[0],
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
        signedAt: '2020-07-06T17:06:04.552Z',
      };

      const results = await migrateItems([mockDocketEntry], documentClient);

      expect(results).toMatchObject([
        {
          ...mockDocketEntry,
          signedByUserId: '60f2059d-3831-4ed1-b93b-8c8beec478a4',
          signedJudgeName: CHIEF_JUDGE,
        },
      ]);
    });

    it('should be pending when the case record is not already blocked for any reason', async () => {
      const MOCK_TRIAL = {};

      documentClient.get = jest
        .fn()
        .mockReturnValueOnce({
          promise: async () => ({
            Item: { ...MOCK_CASE, trialSessionId: MOCK_TRIAL.trialSessionId },
          }),
        })
        .mockReturnValueOnce({
          promise: async () => ({
            Item: MOCK_TRIAL,
          }),
        });

      const mockDocketEntry = {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `docket-entry|${MOCK_CASE.docketNumber}`,
        ...MOCK_CASE.docketEntries[0],
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
        signedAt: '2020-07-06T17:06:04.552Z',
      };

      const results = await migrateItems([mockDocketEntry], documentClient);

      expect(results).toMatchObject([
        {
          ...mockDocketEntry,
          signedByUserId: '60f2059d-3831-4ed1-b93b-8c8beec478a4',
          signedJudgeName: CHIEF_JUDGE,
        },
      ]);
    });
  });

  it('should validate the modified case record', () => {});
});
