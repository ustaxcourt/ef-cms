import {
  computeDocumentFilters,
  computeShouldFilters,
} from './searchQueryForAggregation';

describe('searchQueryForAggregation', () => {
  describe('computeShouldFilters', () => {
    it('should return an empty array when judges is not provided', () => {
      const result = computeShouldFilters({ params: {} as any });
      expect(result).toEqual([]);
    });

    it('should return match filters for each judge name', () => {
      const result = computeShouldFilters({
        params: { judges: ['Judge Buch', 'Judge Colvin'] } as any,
      });

      expect(result).toHaveLength(4);
      expect(result[0]).toMatchObject({
        match: { 'signedJudgeName.S': { operator: 'and', query: 'Judge Buch' } },
      });
      expect(result[1]).toMatchObject({
        match: { 'judge.S': 'Judge Buch' },
      });
      expect(result[2]).toMatchObject({
        match: { 'signedJudgeName.S': { operator: 'and', query: 'Judge Colvin' } },
      });
      expect(result[3]).toMatchObject({
        match: { 'judge.S': 'Judge Colvin' },
      });
    });
  });

  describe('computeDocumentFilters', () => {
    it('should return base filters when no optional params are provided', () => {
      const result = computeDocumentFilters({ params: {} });

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        term: { 'entityName.S': 'DocketEntry' },
      });
      expect(result[1]).toMatchObject({
        exists: { field: 'servedAt' },
      });
      expect(result[2]).toMatchObject({
        term: { 'isStricken.BOOL': false },
      });
    });

    it('should add a date range filter when startDate and endDate are provided', () => {
      const result = computeDocumentFilters({
        params: {
          startDate: '2020-01-01',
          endDate: '2020-12-31',
        },
      });

      expect(result).toHaveLength(4);
      expect(result[3]).toMatchObject({
        range: {
          'filingDate.S': {
            gte: '2020-01-01||/h',
            lte: '2020-12-31||/h',
          },
        },
      });
    });

    it('should not add a date range filter when only startDate is provided', () => {
      const result = computeDocumentFilters({
        params: { startDate: '2020-01-01' },
      });

      expect(result).toHaveLength(3);
    });

    it('should add a terms filter when documentEventCodes are provided', () => {
      const result = computeDocumentFilters({
        params: { documentEventCodes: ['O', 'OCS'] },
      });

      expect(result).toHaveLength(4);
      expect(result[3]).toMatchObject({
        terms: { 'eventCode.S': ['O', 'OCS'] },
      });
    });

    it('should not add a terms filter when documentEventCodes is an empty array', () => {
      const result = computeDocumentFilters({
        params: { documentEventCodes: [] },
      });

      expect(result).toHaveLength(3);
    });

    it('should add both date range and event code filters when all params are provided', () => {
      const result = computeDocumentFilters({
        params: {
          startDate: '2020-01-01',
          endDate: '2020-12-31',
          documentEventCodes: ['O'],
        },
      });

      expect(result).toHaveLength(5);
    });
  });
});
