import {
  CAV_AND_SUBMITTED_CASE_STATUS,
  MAX_ELASTICSEARCH_PAGINATION,
} from '@shared/business/entities/EntityConstants';
import { JudgeActivityReportCavAndSubmittedCasesRequest } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketNumbersByStatusAndByJudge } from './getDocketNumbersByStatusAndByJudge';
import { judgeUser } from '@shared/test/mockUsers';
import { search } from './searchClient';
jest.mock('./searchClient');

describe('getDocketNumbersByStatusAndByJudge', () => {
  const mockValidRequest: JudgeActivityReportCavAndSubmittedCasesRequest = {
    judges: [judgeUser.name],
    statuses: CAV_AND_SUBMITTED_CASE_STATUS,
  };

  const responseResults = {
    results: [
      { docketNumber: '11315-18' },
      { docketNumber: { S: '11316-18' } },
    ],
  };

  it('should make a persistence call to obtain all cases with a status of "Submitted" or "CAV" associated with the given judge', async () => {
    search.mockReturnValue(responseResults);

    const docketNumbersSearchResults = await getDocketNumbersByStatusAndByJudge(
      {
        applicationContext,
        params: mockValidRequest,
      },
    );

    expect(search.mock.calls[0][0].searchParameters.size).toEqual(
      MAX_ELASTICSEARCH_PAGINATION,
    );

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.should,
    ).toMatchObject(
      expect.arrayContaining([
        { match_phrase: { 'associatedJudge.S': judgeUser.name } },
      ]),
    );

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.filter,
    ).toMatchObject(
      expect.arrayContaining([
        {
          terms: { 'status.S': CAV_AND_SUBMITTED_CASE_STATUS },
        },
      ]),
    );

    expect(docketNumbersSearchResults).toMatchObject(responseResults);
  });
});
