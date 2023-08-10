import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesClosedByJudge } from './getCasesClosedByJudge';
import { judgeUser } from '../../../../shared/src/test/mockUsers';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('getCasesClosedByJudge', () => {
  let mockValidRequest = {
    endDate: '03/21/2020',
    judges: [judgeUser.name],
    startDate: '02/12/2020',
  };

  const mockCaseClosed = {
    doc_count: 3,
    key: CASE_STATUS_TYPES.closed,
  };

  const mockCaseClosedDismissed = {
    doc_count: 2,
    key: CASE_STATUS_TYPES.closedDismissed,
  };

  const mockAggregationsResult = {
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
                gte: '02/12/2020||/h',
                lte: '03/21/2020||/h',
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
  };

  beforeAll(() => {
    search.mockReturnValue(mockAggregationsResult);
  });

  it('should make a persistence call to obtain an aggregation of closed cases associated with the given judges within the selected date range', async () => {
    const results = await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(search.mock.calls[0][0].searchParameters.body).toMatchObject(
      mockBodyQuery,
    );

    expect(results).toEqual(mockAggregationsResult);
  });
});
