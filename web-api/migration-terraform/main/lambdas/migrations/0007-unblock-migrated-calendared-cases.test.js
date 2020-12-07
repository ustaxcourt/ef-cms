const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0007-unblock-migrated-calendared-cases');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  const mockTrialSessionId = '7c48bc45-7838-4cf0-a059-0a21e5e4d473';
  const docketEntryWithPendingAndLegacyServed = {
    archived: false,
    docketEntryId: '83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    isLegacyServed: true,
    pending: true,
    pk: 'case|123-20',
    sk: 'docket-entry|124',
    userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
  };

  let mockCaseItem;
  let mockCaseRecords;
  let mockEligibleForTrialItem;
  let documentClient;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: 'case|999-99',
      sk: 'case|999-99',
    };
    mockCaseRecords = [
      mockCaseItem,
      {
        archived: false,
        docketEntryId: '83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        pk: 'case|123-20',
        sk: 'docket-entry|124',
        userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
      },
    ];

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

  it('should return and not modify case records that are not calendared', async () => {
    const items = [
      {
        pk: 'case|999-99',
        sk: 'case|999-99',
        status: CASE_STATUS_TYPES.new,
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'case|999-99',
          sk: 'case|999-99',
          status: CASE_STATUS_TYPES.new,
        },
      ]),
    );
  });

  it('should return and not modify case records that are calendared but not blocked or automatic blocked', async () => {
    const items = [
      {
        automaticBlocked: false,
        blocked: false,
        pk: 'case|999-99',
        sk: 'case|999-99',
        status: CASE_STATUS_TYPES.calendared,
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          automaticBlocked: false,
          blocked: false,
          pk: 'case|999-99',
          sk: 'case|999-99',
          status: CASE_STATUS_TYPES.calendared,
        },
      ]),
    );
  });

  it('should unset automaticBlocked, automaticBlockedReason and automaticBlockedDate on case records that are calendared and automaticBlocked', async () => {
    mockCaseItem.automaticBlocked = true;
    mockCaseItem.automaticBlockedDate = '2019-03-01T21:42:29.073Z';
    mockCaseItem.automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pending;
    mockCaseItem.status = CASE_STATUS_TYPES.calendared;
    mockCaseItem.trialSessionId = mockTrialSessionId;

    documentClient.query = jest.fn().mockReturnValueOnce({
      promise: async () => ({
        Items: mockCaseRecords,
      }),
    });

    const results = await migrateItems([mockCaseItem], documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          automaticBlocked: false,
          automaticBlockedDate: undefined,
          automaticBlockedReason: undefined,
          blocked: false,
          pk: 'case|999-99',
          sk: 'case|999-99',
          status: CASE_STATUS_TYPES.calendared,
        },
      ]),
    );
  });

  describe('automaticBlockedReason', () => {
    it.skip('should be pendingAndDueDate when the case record is already blocked for dueDate', async () => {
      mockCaseItem.automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.dueDate;
      mockCaseRecords.push(docketEntryWithPendingAndLegacyServed);

      documentClient.query = jest.fn().mockReturnValueOnce({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      });

      const results = await migrateItems([mockCaseItem], documentClient);

      expect(results).toEqual([
        {
          ...mockCaseItem,
          automaticBlocked: true,
          automaticBlockedDate: expect.anything(),
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
        },
      ]);
    });

    it.skip('should be pending when the case record is not already blocked for any reason', async () => {
      mockCaseRecords.push(docketEntryWithPendingAndLegacyServed);

      documentClient.query = jest.fn().mockReturnValueOnce({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      });

      const results = await migrateItems([mockCaseItem], documentClient);

      expect(results).toMatchObject([
        {
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
        },
      ]);
    });
  });

  it.skip('should validate the modified case record', async () => {
    documentClient.query = jest.fn().mockReturnValueOnce({
      promise: async () => ({
        Items: [
          mockCaseRecords[1],
          { ...mockCaseRecords[0], docketNumber: undefined },
          docketEntryWithPendingAndLegacyServed,
        ],
      }),
    });

    await expect(
      migrateItems(
        [{ ...mockCaseItem, docketNumber: undefined }],
        documentClient,
      ),
    ).rejects.toThrow('The Case entity was invalid.');
  });

  describe('eligible for trial records', () => {
    it.skip('should return and not modify eligible for trial records for cases that do not have any docket entries that are both pending and isLegacyServed', async () => {
      documentClient.query = jest.fn().mockReturnValueOnce({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      });

      const results = await migrateItems(
        [mockEligibleForTrialItem],
        documentClient,
      );

      expect(results).toEqual([mockEligibleForTrialItem]);
    });

    it.skip('should NOT return eligible for trial records for cases that have docket entries that are pending and isLegacyServe', async () => {
      mockCaseRecords.push(docketEntryWithPendingAndLegacyServed);

      documentClient.query = jest.fn().mockReturnValueOnce({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      });

      const results = await migrateItems(
        [mockEligibleForTrialItem],
        documentClient,
      );

      expect(results).toEqual([]);
    });
  });
});
