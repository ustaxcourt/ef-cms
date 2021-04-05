const {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0026-update-to-stricter-date-format');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
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
        filingDate: '04/20/2006',
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
          filingDate: '2006-04-19T04:00:00.000Z',
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

    it('should not update createdAt, receivedAt when it is already a dateTime stamp', async () => {
      const items = [
        {
          ...mockCase,
          createdAt: '2025-03-01T00:00:22.000Z',
          receivedAt: '2025-04-01T00:00:22.000Z',
        },
      ];

      const results = await migrateItems(items);

      expect(results).toEqual([
        {
          ...mockCase,
          createdAt: '2025-03-01T00:00:22.000Z',
          receivedAt: '2025-04-01T00:00:22.000Z',
        },
      ]);
    });
  });
});
