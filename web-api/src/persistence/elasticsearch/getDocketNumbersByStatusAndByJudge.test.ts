import {
  CAV_AND_SUBMITTED_CASE_STATUS,
  MAX_ELASTICSEARCH_PAGINATION,
} from '@shared/business/entities/EntityConstants';
import {
  DocketNumberByStatusRequest,
  getDocketNumbersByStatusAndByJudge,
} from './getDocketNumbersByStatusAndByJudge';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { judgeUser } from '@shared/test/mockUsers';
import { search } from './searchClient';
jest.mock('./searchClient');

describe('getDocketNumbersByStatusAndByJudge', () => {
  const mockValidRequest: DocketNumberByStatusRequest = {
    judges: [judgeUser.name],
    statuses: CAV_AND_SUBMITTED_CASE_STATUS,
  };

  const responseResults = [
    { docketNumber: '11315-18' },
    { docketNumber: { S: '11316-18' } },
  ];

  it('should make a persistence call to obtain all cases with a status of "Submitted" or "CAV" associated with the given judges', async () => {
    search.mockReturnValue({ results: responseResults });

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

  it('should make a persistence call to obtain all cases with a status of "Submitted" or "CAV" without judges', async () => {
    search.mockReturnValue({ results: responseResults });

    await getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: { ...mockValidRequest, judges: undefined },
    });

    expect(search.mock.calls[0][0].searchParameters.size).toEqual(
      MAX_ELASTICSEARCH_PAGINATION,
    );

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.should,
    ).toMatchObject([]);

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.filter,
    ).toMatchObject(
      expect.arrayContaining([
        {
          terms: { 'status.S': CAV_AND_SUBMITTED_CASE_STATUS },
        },
      ]),
    );
  });
});
