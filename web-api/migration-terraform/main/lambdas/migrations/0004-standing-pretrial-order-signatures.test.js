const {
  CHIEF_JUDGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
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

  it('should return and not modify original records', async () => {
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

  it('should return and not modify docket entries that are NOT Standing Pretrial Orders or Standing Pretrial Order for Small Case', async () => {
    const mockDocketEntry = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `docket-entry|${MOCK_CASE.docketNumber}`,
      ...MOCK_CASE.docketEntries[0],
    };

    const results = await migrateItems([mockDocketEntry], documentClient);

    expect(results).toEqual([mockDocketEntry]);
  });

  it('should return and not modify docket entries that are Standing Pretrial Orders with signature data', async () => {
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

  it('should add signedAt, signedJudgeName, and signedByUserId to docket entries that are Standing Pretrial Orders lacking signature data', async () => {
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

  it('should add signedAt and default signedJudgeName and signedByUserId to docket entries that are Standing Pretrial Orders lacking signature data WITH a found trial session but WITHOUT a judge', async () => {
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

  it('should add signedAt and default signedJudgeName and signedByUserId to docket entries that are Standing Pretrial Orders lacking signature data without a found trial session', async () => {
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

  it('should add signedAt, signedJudgeName, and signedByUserId to docket entries that are Standing Pretrial Order for Small Case lacking signature data', async () => {
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
      eventCode: 'SPOS',
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

  it('should set signedJudgeName to Chief Judge and default other values when the case the docket entry belongs has not been added to a trial session', async () => {
    documentClient.get = jest.fn().mockReturnValueOnce({
      promise: async () => ({
        Item: MOCK_CASE,
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

  it('should validate modified docket entries', async () => {
    const MOCK_TRIAL = {
      judge: {
        name: 'Michael Scott',
        userId: 'NOT_A_VALID_GUID',
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
      isMinuteEntry: undefined,
      signedAt: '2020-07-06T17:06:04.552Z',
    };

    await expect(
      migrateItems([mockDocketEntry], documentClient),
    ).rejects.toThrow(
      'The DocketEntry entity was invalid. {"signedByUserId":"\'signedByUserId\' must be a valid GUID"}',
    );
  });

  it("should use docketNumber from docket entry's pk to retrieve case record", async () => {
    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {},
      }),
    });

    const DOCKET_NUMBER = '109-20';
    const mockDocketEntry = {
      pk: `case|${DOCKET_NUMBER}`,
      sk: 'docket-entry|4ed22b10-4bc5-4d49-b6f6-8cb448280e16',
      ...MOCK_CASE.docketEntries[0],
      docketNumber: undefined,
      eventCode: 'SPOS',
      signedAt: '2020-07-06T17:06:04.552Z',
    };

    await migrateItems([mockDocketEntry], documentClient);

    expect(documentClient.get.mock.calls[0][0].Key).toMatchObject({
      pk: `case|${DOCKET_NUMBER}`,
      sk: `case|${DOCKET_NUMBER}`,
    });
  });
});
