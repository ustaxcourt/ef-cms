import { MAX_ELASTICSEARCH_PAGINATION } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../business/test/createTestApplicationContext';
import { getCasesClosedByJudge } from './getCasesClosedByJudge';
import { judgeUser } from '../../test/mockUsers';

describe('getCasesClosedByJudge', () => {
  let mockValidRequest = {
    endDate: '03/21/2020',
    judgeName: judgeUser.name,
    startDate: '02/12/2020',
  };

  it('should make a persistence call to obtain all closed cases associated with the given judge within the selected date range', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(MAX_ELASTICSEARCH_PAGINATION);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
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
        must: [
          {
            match_phrase: {
              'associatedJudge.S': 'Sotomayor',
            },
          },
        ],
        must_not: [],
      },
    });
  });

  it('should make a persistence call to obtain all closed cases for no specified judge within the selected date range', async () => {
    mockValidRequest = {
      ...mockValidRequest,
      judgeName: '',
    };

    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(MAX_ELASTICSEARCH_PAGINATION);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
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
        must: [],
        must_not: [
          {
            match_phrase: {
              'associatedJudge.S': 'Chief Judge',
            },
          },
        ],
      },
    });
  });
});
