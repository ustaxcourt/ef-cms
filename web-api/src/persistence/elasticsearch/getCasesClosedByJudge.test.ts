import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { CasesClosedType } from '@web-client/presenter/judgeActivityReportState';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesClosedByJudge } from './getCasesClosedByJudge';
import { judgeUser } from '../../../../shared/src/test/mockUsers';

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

  const mockReturnedCloseCases: CasesClosedType = {
    [CASE_STATUS_TYPES.closed]: 3,
    [CASE_STATUS_TYPES.closedDismissed]: 2,
  };

  const mockAggregations = {
    closed_cases: {
      buckets: [mockCaseClosed, mockCaseClosedDismissed],
    },
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
    applicationContext.getSearchClient().search.mockReturnValue({
      body: { aggregations: mockAggregations },
    });
  });

  it('should make a persistence call to obtain all closed cases associated with the given judge within the selected date range', async () => {
    const closedCases: CasesClosedType = await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body,
    ).toMatchObject(mockBodyQuery);

    expect(closedCases).toEqual(mockReturnedCloseCases);
  });

  it('should make a persistence call to obtain all closed cases for no specified judge within the selected date range', async () => {
    const mockJudges = [judgeUser.name, 'Buch'];

    mockBodyQuery.query.bool.should = [
      {
        match_phrase: {
          'associatedJudge.S': mockJudges[0],
        },
      },
      {
        match_phrase: {
          'associatedJudge.S': mockJudges[1],
        },
      },
    ];
    mockValidRequest = {
      ...mockValidRequest,
      judges: mockJudges,
    };

    const closedCases: CasesClosedType = await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body,
    ).toMatchObject(mockBodyQuery);

    expect(closedCases).toEqual(mockReturnedCloseCases);
  });

  it('should return default values of zero for both closed and closed - dismissed for judges with no closed cases', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: { aggregations: { closed_cases: { buckets: [] } } },
    });

    const mockReturnedCloseCasesWithZeroItems = {
      [CASE_STATUS_TYPES.closed]: 0,
      [CASE_STATUS_TYPES.closedDismissed]: 0,
    };

    const closedCases: CasesClosedType = await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body,
    ).toMatchObject(mockBodyQuery);

    expect(closedCases).toEqual(mockReturnedCloseCasesWithZeroItems);
  });
});
