const { migrateItems } = require('./0026-update-to-stricter-date-format');

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
});
