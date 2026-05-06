import {
  computeDocumentFilters,
  computeShouldFilters,
} from './searchQueryForAggregation';

describe('computeShouldFilters', () => {
  it('returns an empty list when no judges are provided', () => {
    const result = computeShouldFilters({ params: {} as any });
    expect(result).toEqual([]);
  });

  it('returns match filters for each judge when judges are provided', () => {
    const result = computeShouldFilters({
      params: { judges: ['Judge A', 'Judge B'] } as any,
    });

    expect(result).toHaveLength(4);
    expect(result).toEqual(
      expect.arrayContaining([
        {
          match: {
            'signedJudgeName.S': {
              operator: 'and',
              query: 'Judge A',
            },
          },
        },
        {
          match: {
            'judge.S': 'Judge A',
          },
        },
        {
          match: {
            'signedJudgeName.S': {
              operator: 'and',
              query: 'Judge B',
            },
          },
        },
        {
          match: {
            'judge.S': 'Judge B',
          },
        },
      ]),
    );
  });
});

describe('computeDocumentFilters', () => {
  it('returns base filters when no optional params are provided', () => {
    const result = computeDocumentFilters({ params: {} });

    expect(result).toEqual([
      { term: { 'entityName.S': 'DocketEntry' } },
      { exists: { field: 'servedAt' } },
      { term: { 'isStricken.BOOL': false } },
    ]);
  });

  it('adds a date-range filter when both startDate and endDate are provided', () => {
    const result = computeDocumentFilters({
      params: { endDate: '2024-12-31', startDate: '2024-01-01' },
    });

    expect(result).toEqual(
      expect.arrayContaining([
        {
          range: {
            'filingDate.S': {
              gte: '2024-01-01||/h',
              lte: '2024-12-31||/h',
            },
          },
        },
      ]),
    );
  });

  it('does not add a date-range filter when only startDate is provided', () => {
    const result = computeDocumentFilters({
      params: { startDate: '2024-01-01' },
    });

    expect(result.some(f => 'range' in f)).toBe(false);
  });

  it('adds an event-code filter when documentEventCodes has items', () => {
    const result = computeDocumentFilters({
      params: { documentEventCodes: ['O', 'OAJ'] },
    });

    expect(result).toEqual(
      expect.arrayContaining([
        { terms: { 'eventCode.S': ['O', 'OAJ'] } },
      ]),
    );
  });

  it('does not add an event-code filter when documentEventCodes is an empty list', () => {
    const result = computeDocumentFilters({
      params: { documentEventCodes: [] },
    });

    expect(result.some(f => 'terms' in f)).toBe(false);
  });
});
