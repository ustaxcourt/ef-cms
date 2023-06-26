import {
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
  CAV_AND_SUBMITTED_CASE_STATUS,
} from '../../business/entities/EntityConstants';
import { JudgeActivityReportCavAndSubmittedCasesRequestType } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { applicationContext } from '../../business/test/createTestApplicationContext';
import { getDocketNumbersByStatusAndByJudge } from './getDocketNumbersByStatusAndByJudge';
import { judgeUser } from '../../test/mockUsers';

describe('getDocketNumbersByStatusAndByJudge', () => {
  const mockValidRequest: JudgeActivityReportCavAndSubmittedCasesRequestType = {
    judgeName: judgeUser.name,
    pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
    searchAfter: {
      docketNumber: 1234,
    },
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
    ).toEqual(CAV_AND_SUBMITTED_CASES_PAGE_SIZE);

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body
        .search_after,
    ).toEqual([mockValidRequest.searchAfter.docketNumber]);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toMatchObject(
      expect.objectContaining([
        {
          terms: { 'status.S': mockValidRequest.statuses },
        },
        {
          match_phrase: {
            'associatedJudge.S': `${judgeUser.name}`,
          },
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
      lastIdOfPage: {
        docketNumber: 2018011316,
      },
    });
  });

  it('should make a persistence call to obtain all the cases for all judges with "Submitted" or "CAV" cases (no specified judge selection)', async () => {
    mockValidRequest.judgeName = 'All Judges';

    await getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].size,
    ).toEqual(CAV_AND_SUBMITTED_CASES_PAGE_SIZE);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body
        .search_after,
    ).toEqual([mockValidRequest.searchAfter.docketNumber]);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toMatchObject(
      expect.not.arrayContaining([
        {
          terms: { 'status.S': mockValidRequest.statuses },
        },
        {
          match_phrase: {
            'associatedJudge.S': 'All Judges',
          },
        },
      ]),
    );
  });
});
