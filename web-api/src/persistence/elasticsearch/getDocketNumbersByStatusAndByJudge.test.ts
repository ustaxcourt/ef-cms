import {
  CAV_AND_SUBMITTED_CASE_STATUS,
  MAX_ELASTICSEARCH_PAGINATION,
} from '@shared/business/entities/EntityConstants';
import { JudgeActivityReportCavAndSubmittedCasesRequest } from '@web-client/presenter/judgeActivityReportState';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketNumbersByStatusAndByJudge } from './getDocketNumbersByStatusAndByJudge';
import { judgeUser } from '../../../../shared/src/test/mockUsers';

describe('getDocketNumbersByStatusAndByJudge', () => {
  const mockValidRequest: JudgeActivityReportCavAndSubmittedCasesRequest = {
    judges: [judgeUser.name],
    statuses: CAV_AND_SUBMITTED_CASE_STATUS,
  };

  const responseResults = {
    body: {
      hits: {
        hits: [
          {
            _id: 'case|11315-18_case|11315-18',
            _index: 'efcms-case',
            _score: null,
            _source: { docketNumber: { S: '11315-18' } },
            _type: '_doc',
            sort: [2018011315],
          },
          {
            _id: 'case|11316-18_case|11316-18',
            _index: 'efcms-case',
            _score: null,
            _source: { docketNumber: { S: '11316-18' } },
            _type: '_doc',
            sort: [2018011316],
          },
        ],
      },
    },
  };

  it('should make a persistence call to obtain all cases with a status of "Submitted" or "CAV" associated with the given judge', async () => {
    applicationContext
      .getSearchClient()
      .search.mockReturnValue(responseResults);

    const results = await getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].size,
    ).toEqual(MAX_ELASTICSEARCH_PAGINATION);

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toMatchObject(
      expect.arrayContaining([
        {
          bool: {
            should: [{ match_phrase: { 'associatedJudge.S': judgeUser.name } }],
          },
        },
      ]),
    );

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.filter,
    ).toMatchObject(
      expect.arrayContaining([
        {
          terms: { 'status.S': CAV_AND_SUBMITTED_CASE_STATUS },
        },
      ]),
    );

    expect(results).toMatchObject({
      foundCases: [
        {
          docketNumber: '11315-18',
        },
        {
          docketNumber: '11316-18',
        },
      ],
    });
  });
});
