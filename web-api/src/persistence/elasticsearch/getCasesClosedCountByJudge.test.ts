import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesClosedCountByJudge } from './getCasesClosedCountByJudge';
jest.mock('./searchClient');
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { casesClosedResults } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor.test';
import { judgeUser } from '@shared/test/mockUsers';
import { search } from './searchClient';

describe('getCasesClosedCountByJudge', () => {
  const mockEndDate = '03/21/2020';
  const mockStartDate = '02/12/2020';

  let mockValidRequest = {
    endDate: mockEndDate,
    judges: [judgeUser.name],
    startDate: mockStartDate,
  };

  const mockCaseClosed = {
    doc_count: 3,
    key: CASE_STATUS_TYPES.closed,
  };

  const mockCaseClosedDismissed = {
    doc_count: 2,
    key: CASE_STATUS_TYPES.closedDismissed,
  };

  let mockAggregationsResult = {
    aggregations: {
      closed_cases: {
        buckets: [mockCaseClosed, mockCaseClosedDismissed],
      },
    },
    total: 5,
  };

  let mockBodyQuery = {
    aggs: {
      closed_cases: {
        terms: {
          field: 'status.S',
        },
      },
    },
    query: {
      bool: {
        filter: [
          {
            range: {
              'closedDate.S': {
                gte: `${mockStartDate}||/h`,
                lte: `${mockEndDate}||/h`,
              },
            },
          },
        ],
        minimum_should_match: 1,
        should: [
          {
            match_phrase: {
              'associatedJudge.S': judgeUser.name,
            },
          },
        ],
      },
    },
    size: 0,
    track_total_hits: true,
  };

  beforeAll(() => {
    search.mockReturnValue(mockAggregationsResult);
  });

  it('should make a persistence call to obtain an aggregation of closed cases associated with the given judges within the selected date range', async () => {
    const results = await getCasesClosedCountByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(search.mock.calls[0][0].searchParameters.body).toMatchObject(
      mockBodyQuery,
    );

    expect(results).toEqual(casesClosedResults);
  });

  it('should return a zero count(s) for both closed and closed - dismissed for judges if there no closed cases associated with selected judges', async () => {
    mockAggregationsResult.aggregations.closed_cases.buckets = [];
    search.mockReturnValue(mockAggregationsResult);

    applicationContext
      .getPersistenceGateway()
      .getCasesClosedCountByJudge.mockResolvedValue(casesClosedResults);

    const mockReturnedCloseCasesWithZeroItems = {
      [CASE_STATUS_TYPES.closed]: 0,
      [CASE_STATUS_TYPES.closedDismissed]: 0,
    };

    const closedCasesResults = await getCasesClosedCountByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(closedCasesResults.aggregations).toEqual(
      mockReturnedCloseCasesWithZeroItems,
    );
  });
});
