const {
  migrateItems,
} = require('./0025-docket-entry-received-at-strict-timestamp.js');

describe('migrateItems', () => {
  describe('caseDeadline', () => {
    it('should update createdAt and deadlineDate to be ISO formatted dates', async () => {
      const mockCaseDeadline = {
        associatedJudge: 'Judge Buch',
        createdAt: '2019-04-01',
        deadlineDate: '2019-03-01',
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
          createdAt: '2019-04-01T00:00:00.000Z',
          deadlineDate: '2019-03-01T00:00:00.000Z',
        },
      ]);
    });
  });
});
