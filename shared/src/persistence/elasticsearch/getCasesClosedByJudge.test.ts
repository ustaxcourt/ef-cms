import { applicationContext } from '../../business/test/createTestApplicationContext';
import { getCasesClosedByJudge } from './getCasesClosedByJudge';
import { judgeUser } from '../../test/mockUsers';

describe('getCasesClosedByJudge', () => {
  const mockValidRequest = {
    endDate: '03/21/2020',
    judgeName: judgeUser.name,
    startDate: '02/12/2020',
  };

  it('should obtain all closed cases associated with the given judge within the selected date range', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(10000);
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
      },
    });
  });
});
