import { MAX_ELASTICSEARCH_PAGINATION } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../business/test/createTestApplicationContext';
import { getCasesClosedByJudge } from './getCasesClosedByJudge';
import { judgeUser } from '../../test/mockUsers';

describe('getCasesClosedByJudge', () => {
  let mockValidRequest = {
    endDate: '03/21/2020',
    judges: [judgeUser.name],
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
              'associatedJudge.S': judgeUser.name,
            },
          },
        ],
      },
    });
  });

  it('should make a persistence call to obtain all closed cases for no specified judge within the selected date range', async () => {
    const mockJudges = [judgeUser.name, 'Buch'];
    mockValidRequest = {
      ...mockValidRequest,
      judges: mockJudges,
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
        must: [
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
        ],
      },
    });
  });
});
