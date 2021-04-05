const { migrateItems } = require('./0026-update-to-stricter-date-format');

describe('migrateItems', () => {
  describe('caseDeadline', () => {
    it('should update createdAt and deadlineDate to be ISO formatted dates', async () => {
      const mockCaseDeadline = {
        associatedJudge: 'Judge Buch',
        createdAt: '2019-07-01',
        deadlineDate: '2019-08-01',
        description: 'One small step',
        docketNumber: '170-34',
        pk: 'case-deadline|000-00',
        sk: 'case-deadline|6d74eadc-0181-4ff5-826c-305200e8733d',
      };

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
      const mockCaseDeadline = {
        associatedJudge: 'Judge Buch',
        createdAt: '2019-07-01',
        description: 'One small step',
        docketNumber: '170-34',
        pk: 'case-deadline|000-00',
        sk: 'case-deadline|6d74eadc-0181-4ff5-826c-305200e8733d',
      };

      const items = [mockCaseDeadline];

      await expect(migrateItems(items)).rejects.toThrow();
    });

    it('should not createISODateAtStartOfDayEST if the date is valid', async () => {
      const mockCaseDeadline = {
        associatedJudge: 'Judge Buch',
        createdAt: '2019-07-01',
        deadlineDate: '2019-08-01',
        description: 'One small step',
        docketNumber: '170-34',
        pk: 'case-deadline|000-00',
        sk: 'case-deadline|6d74eadc-0181-4ff5-826c-305200e8733d',
      };

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
  });
});
