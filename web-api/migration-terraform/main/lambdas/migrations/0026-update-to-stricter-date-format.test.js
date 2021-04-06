const {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0026-update-to-stricter-date-format');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  it('should not update record that is not a case deadline, correspondence, message, case, docket entry, or trial session', async () => {
    const items = [
      {
        pk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
        sk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  describe('caseDeadline', () => {
    let mockCaseDeadline;

    beforeEach(() => {
      mockCaseDeadline = {
        associatedJudge: 'Judge Buch',
        createdAt: '2019-07-01',
        deadlineDate: '2019-08-01',
        description: 'One small step',
        docketNumber: '170-34',
        pk: 'case-deadline|000-00',
        sk: 'case-deadline|6d74eadc-0181-4ff5-826c-305200e8733d',
      };
    });

    it('should update createdAt and deadlineDate to be ISO formatted dates', async () => {
      const items = [mockCaseDeadline];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCaseDeadline,
          createdAt: '2019-07-01T04:00:00.000Z',
          deadlineDate: '2019-08-01T04:00:00.000Z',
        },
      ]);
    });

    it('should throw an error when the item does not have a deadline date', async () => {
      mockCaseDeadline.deadlineDate = undefined; //deadlineDate is required

      const items = [mockCaseDeadline];

      await expect(migrateItems(items)).rejects.toThrow();
    });

    it('should not update deadlineDate or createdAt if dates are already dateTime stamps', async () => {
      const mockCreatedAt = '2019-07-01T04:00:12.000Z';
      const mockDeadlineDate = '2019-08-01T04:00:34.000Z';
      mockCaseDeadline.createdAt = mockCreatedAt;
      mockCaseDeadline.deadlineDate = mockDeadlineDate;

      const items = [mockCaseDeadline];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCaseDeadline,
          createdAt: mockCreatedAt,
          deadlineDate: mockDeadlineDate,
        },
      ]);
    });
  });

  describe('correspondence', () => {
    let mockCorrespondence;

    beforeEach(() => {
      mockCorrespondence = {
        correspondenceId: 'e9ab90a9-2150-4dd1-90b4-fee2097c23db',
        documentTitle: 'A Title',
        filingDate: '2006-04-20',
        pk: 'case|000-00',
        sk: 'correspondence|6d74eadc-0181-4ff5-826c-305200e8733d',
        userId: 'a389ca07-f19e-45d4-8e77-5cb79c9285ae',
      };
    });

    it('should update filingDate to be an ISO formatted date', async () => {
      const items = [mockCorrespondence];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCorrespondence,
          filingDate: '2006-04-20T04:00:00.000Z',
        },
      ]);
    });

    it('should throw an error when the item is invalid', async () => {
      mockCorrespondence.documentTitle = undefined; // documentTitle is required

      const items = [mockCorrespondence];

      await expect(migrateItems(items)).rejects.toThrow();
    });

    it('should not update filingDate when it is already a dateTime stamp', async () => {
      const mockFilingDate = '2019-08-01T04:00:34.000Z';
      mockCorrespondence.filingDate = mockFilingDate;

      const items = [mockCorrespondence];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCorrespondence,
          filingDate: mockFilingDate,
        },
      ]);
    });
  });

  describe('message', () => {
    let mockMessage;

    beforeEach(() => {
      mockMessage = {
        caseStatus: CASE_STATUS_TYPES.generalDocket,
        caseTitle: 'Test Petitioner',
        completedAt: '2020-02-02',
        createdAt: '2019-01-01',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45S',
        from: 'gg',
        fromSection: PETITIONS_SECTION,
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'hello world',
        pk: 'case|101-22',
        sk: 'message|3d21c047-2821-4f72-b12d-9ee72baf68eb',
        subject: 'hey!',
        to: 'bob',
        toSection: PETITIONS_SECTION,
        toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      };
    });

    it('should update createdAt and completedAt to be an ISO formatted date', async () => {
      const items = [mockMessage];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockMessage,
          completedAt: '2020-02-02T05:00:00.000Z',
          createdAt: '2019-01-01T05:00:00.000Z',
        },
      ]);
    });

    it('should throw an error when the item is invalid', async () => {
      mockMessage.caseStatus = undefined; // caseStatus is required

      const items = [mockMessage];

      await expect(migrateItems(items)).rejects.toThrow();
    });

    it('should not update createdAt or completedAt when it is already a dateTime stamp', async () => {
      const mockCreatedAt = '2019-08-01T04:00:34.000Z';
      const mockCompletedAt = '2019-08-01T04:00:34.000Z';
      mockMessage.createdAt = mockCreatedAt;
      mockMessage.completedAt = mockCreatedAt;

      const items = [mockMessage];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockMessage,
          completedAt: mockCompletedAt,
          createdAt: mockCreatedAt,
        },
      ]);
    });
  });

  describe('statistic', () => {
    let mockStatistic;
    let mockCase;

    beforeEach(() => {
      mockStatistic = {
        irsDeficiencyAmount: 1,
        irsTotalPenalties: 1,
        lastDateOfPeriod: '2020-03-01',
        yearOrPeriod: 'Period',
      };

      mockCase = {
        ...MOCK_CASE,
        pk: 'case|101-20',
        sk: 'case|101-20',
        statistics: [mockStatistic],
      };
    });

    it('should update statistic lastDateOfPeriod to be an ISO formatted date', async () => {
      const items = [mockCase];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          statistics: [
            {
              ...mockStatistic,
              lastDateOfPeriod: '2020-03-01T05:00:00.000Z',
            },
          ],
        },
      ]);
    });

    it('should throw an error when the item is invalid', async () => {
      mockCase.docketNumber = undefined; // status is required

      const items = [mockCase];

      await expect(migrateItems(items)).rejects.toThrow();
    });

    it('should not update lastDateOfPeriod when it is already a dateTime stamp', async () => {
      const mockLastDateOfPeriod = '2019-08-01T04:00:34.000Z';
      mockCase.statistics[0].lastDateOfPeriod = mockLastDateOfPeriod;

      const items = [mockCase];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          statistics: [
            {
              ...mockCase.statistics[0],
              lastDateOfPeriod: mockLastDateOfPeriod,
            },
          ],
        },
      ]);
    });
  });

  describe('trialSession', () => {
    const mockTrialSession = {
      createdAt: '2025-03-01',
      maxCases: 100,
      pk: 'trial-session|000-00',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: 'Regular',
      sk: 'trial-session|6d74eadc-0181-4ff5-826c-305200e8733d',
      startDate: '2025-03-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2025',
      trialLocation: 'Birmingham, Alabama',
    };

    it('should update createdAt to be an ISO formatted date', async () => {
      const items = [mockTrialSession];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockTrialSession,
          createdAt: '2025-03-01T05:00:00.000Z',
        },
      ]);
    });

    it('should update noticeIssuedDate to be an ISO formatted date', async () => {
      const items = [{ ...mockTrialSession, noticeIssuedDate: '2025-03-01' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockTrialSession,
          noticeIssuedDate: '2025-03-01T05:00:00.000Z',
        },
      ]);
    });

    it('should update startDate to be an ISO formatted date', async () => {
      const items = [{ ...mockTrialSession, startDate: '2025-03-01' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockTrialSession,
          startDate: '2025-03-01T05:00:00.000Z',
        },
      ]);
    });

    it('should update removedFromTrialDate to be an ISO formatted date', async () => {
      const items = [
        { ...mockTrialSession, removedFromTrialDate: '2025-03-01' },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockTrialSession,
          removedFromTrialDate: '2025-03-01T05:00:00.000Z',
        },
      ]);
    });

    it('should throw an error when the item is invalid', async () => {
      const items = [{ ...mockTrialSession, maxCases: undefined }]; // maxCases is required

      await expect(migrateItems(items)).rejects.toThrow();
    });

    it('should not update createdAt, noticeIssuedDate, startDate, or removedFromTrialDate when they are already a dateTime stamp', async () => {
      const items = [
        {
          ...mockTrialSession,
          createdAt: '2025-03-01T00:00:00.000Z',
          noticeIssuedDate: '2025-03-01T00:00:00.000Z',
          removedFromTrialDate: '2025-03-01T00:00:00.000Z',
          startDate: '2025-03-01T00:00:00.000Z',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockTrialSession,
          createdAt: '2025-03-01T00:00:00.000Z',
          noticeIssuedDate: '2025-03-01T00:00:00.000Z',
          removedFromTrialDate: '2025-03-01T00:00:00.000Z',
          startDate: '2025-03-01T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('case', () => {
    let mockCase;

    beforeEach(() => {
      mockCase = {
        ...MOCK_CASE,
        pk: 'case|101-20',
        sk: 'case|101-20',
      };
    });

    it('should update createdAt to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, createdAt: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          createdAt: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update receivedAt to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, receivedAt: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          receivedAt: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update noticeOfTrialDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, noticeOfTrialDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          noticeOfTrialDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update automaticBlockedDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, automaticBlockedDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          automaticBlockedDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update blockedDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, blockedDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          blockedDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update closedDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, closedDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          closedDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update irsNoticeDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, irsNoticeDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          irsNoticeDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update petitionPaymentDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, petitionPaymentDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          petitionPaymentDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update petitionPaymentWaivedDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, petitionPaymentWaivedDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          petitionPaymentWaivedDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update sealedDate to be an ISO formatted date', async () => {
      const items = [{ ...mockCase, sealedDate: '2020-10-20' }];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          sealedDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should trialDate sealedDate to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockCase,
          trialDate: '2020-10-20',
          trialSessionId: '3ca27710-7538-494f-835d-65a35ee1ebed',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          trialDate: '2020-10-20T04:00:00.000Z',
          trialSessionId: '3ca27710-7538-494f-835d-65a35ee1ebed',
        },
      ]);
    });

    it('should not update createdAt, receivedAt, petitionPaymentWaivedDate, trialDate, sealedDate, noticeOfTrialDate, petitionPaymentDate, automaticBlockedDate, blockedDate, closedDate, irsNoticeDate when they are already a dateTime stamp', async () => {
      const items = [
        {
          ...mockCase,
          automaticBlockedDate: '2025-04-01T00:00:22.000Z',
          blockedDate: '2025-04-01T00:00:22.000Z',
          closedDate: '2025-04-01T00:00:22.000Z',
          createdAt: '2025-03-01T00:00:22.000Z',
          irsNoticeDate: '2020-04-01T00:00:22.000Z',
          noticeOfTrialDate: '2025-04-01T00:00:22.000Z',
          petitionPaymentDate: '2025-04-01T00:00:22.000Z',
          petitionPaymentWaivedDate: '2025-04-01T00:00:22.000Z',
          receivedAt: '2025-04-01T00:00:22.000Z',
          sealedDate: '2025-04-01T00:00:22.000Z',
          trialDate: '2025-04-01T00:00:22.000Z',
          trialSessionId: '3ca27710-7538-494f-835d-65a35ee1ebed',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          automaticBlockedDate: '2025-04-01T00:00:22.000Z',
          blockedDate: '2025-04-01T00:00:22.000Z',
          closedDate: '2025-04-01T00:00:22.000Z',
          createdAt: '2025-03-01T00:00:22.000Z',
          irsNoticeDate: '2020-04-01T00:00:22.000Z',
          noticeOfTrialDate: '2025-04-01T00:00:22.000Z',
          petitionPaymentDate: '2025-04-01T00:00:22.000Z',
          petitionPaymentWaivedDate: '2025-04-01T00:00:22.000Z',
          receivedAt: '2025-04-01T00:00:22.000Z',
          sealedDate: '2025-04-01T00:00:22.000Z',
          trialDate: '2025-04-01T00:00:22.000Z',
          trialSessionId: '3ca27710-7538-494f-835d-65a35ee1ebed',
        },
      ]);
    });
  });

  describe('docketEntry', () => {
    let mockDocketEntry;

    beforeEach(() => {
      mockDocketEntry = {
        createdAt: '2020-07-17T19:28:29.675Z',
        docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
        documentType: 'Petition',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        pk: 'case|2bce00a4-107c-4caa-8381-e07d0c1aefad',
        receivedAt: '2020-07-17T19:28:29.675Z',
        role: ROLES.petitioner,
        sk: 'docket-entry|eb431962-9138-40ff-b05b-99f5d3fae785',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      };
    });

    it('should update certificateOfServiceDate to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          certificateOfServiceDate: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          certificateOfServiceDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update createdAt to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          createdAt: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          createdAt: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update date to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          date: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          date: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update filingDate to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          filingDate: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          filingDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update qcAt to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          qcAt: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          qcAt: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update receivedAt to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          receivedAt: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          receivedAt: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update serviceDate to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          serviceDate: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          serviceDate: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should update strickenAt to be an ISO formatted date', async () => {
      const items = [
        {
          ...mockDocketEntry,
          strickenAt: '2020-10-20',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          strickenAt: '2020-10-20T04:00:00.000Z',
        },
      ]);
    });

    it('should not update certificateOfServiceDate, createdAt, date, filingDate, qcAt, receivedAt, serviceDate, or strickenAt when they are already a dateTime stamp', async () => {
      const items = [
        {
          ...mockDocketEntry,
          certificateOfServiceDate: '2025-04-01T00:00:22.000Z',
          createdAt: '2025-04-01T00:00:22.000Z',
          date: '2025-04-01T00:00:22.000Z',
          filingDate: '2020-03-01T00:00:22.000Z',
          qcAt: '2020-04-01T00:00:22.000Z',
          receivedAt: '2025-04-01T00:00:22.000Z',
          serviceDate: '2020-04-01T00:00:22.000Z',
          strickenAt: '2020-04-01T00:00:22.000Z',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockDocketEntry,
          certificateOfServiceDate: '2025-04-01T00:00:22.000Z',
          createdAt: '2025-04-01T00:00:22.000Z',
          date: '2025-04-01T00:00:22.000Z',
          filingDate: '2020-03-01T00:00:22.000Z',
          qcAt: '2020-04-01T00:00:22.000Z',
          receivedAt: '2025-04-01T00:00:22.000Z',
          serviceDate: '2020-04-01T00:00:22.000Z',
          strickenAt: '2020-04-01T00:00:22.000Z',
        },
      ]);
    });

    it('should throw an error when the item is invalid', async () => {
      mockDocketEntry.documentType = undefined; // documentType is required

      const items = [mockDocketEntry];

      await expect(migrateItems(items)).rejects.toThrow();
    });
  });
});
