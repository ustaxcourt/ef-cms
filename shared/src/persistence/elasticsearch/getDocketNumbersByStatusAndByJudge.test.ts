import { applicationContext } from '../../business/test/createTestApplicationContext';
import { getDocketNumbersByStatusAndByJudge } from './getDocketNumbersByStatusAndByJudge';
import { judgeUser } from '../../test/mockUsers';

describe('getDocketNumbersByStatusAndByJudge', () => {
  const mockValidRequest = {
    judgeName: judgeUser.name,
    statuses: ['CAV', 'Submitted'],
  };

  it('should obtain all cases with a status of "Submitted" or "CAV" associated with the given judge', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getDocketNumbersByStatusAndByJudge({
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
        must: [
          {
            match_phrase: {
              'associatedJudge.S': `${judgeUser.name}`,
            },
          },
          {
            terms: { 'status.S': mockValidRequest.statuses },
          },
        ],
      },
    });
  });
});
