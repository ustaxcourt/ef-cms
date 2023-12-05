import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getAllPendingMotionDocketEntriesForJudge } from '@web-api/persistence/elasticsearch/docketEntry/getAllPendingMotionDocketEntriesForJudge';
jest.mock('../searchClient');
import { MOTION_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { searchAll } from '../searchClient';

describe('getAllPendingMotionDocketEntriesForJudge', () => {
  const TEST_JUDGE_NAME = 'TEST_JUDGE_NAME';

  it('should run the searchAll method with correct query', async () => {
    (searchAll as jest.Mock).mockReturnValue({
      results: ['some', 'matches'],
      total: 2,
    });

    const results = await getAllPendingMotionDocketEntriesForJudge({
      applicationContext,
      judge: TEST_JUDGE_NAME,
    });

    expect(searchAll).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject({
      results: ['some', 'matches'],
      total: 2,
    });

    const searchParams = (searchAll as jest.Mock).mock.calls[0][0]
      .searchParameters;

    expect(searchParams.index).toEqual('efcms-docket-entry');

    const [hasParentParam, pendingMust, createdAtMust, eventCodeMust] =
      searchParams.body.query.bool.must;
    expect(hasParentParam).toEqual({
      has_parent: {
        inner_hits: {
          _source: {
            includes: [
              'associatedJudge',
              'caseCaption',
              'docketNumber',
              'docketNumberSuffix',
              'status',
              'leadDocketNumber',
              'trialDate',
              'trialLocation',
              'docketNumberWithSuffix',
            ],
          },
          name: 'case-mappings',
        },
        parent_type: 'case',
        query: {
          bool: {
            must: [
              {
                match_phrase: {
                  'associatedJudge.S': 'TEST_JUDGE_NAME',
                },
              },
            ],
          },
        },
      },
    });

    expect(pendingMust).toEqual({
      term: {
        'pending.BOOL': true,
      },
    });

    expect(createdAtMust).toEqual({
      range: {
        'createdAt.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          lte: expect.anything(),
        },
      },
    });

    expect(eventCodeMust).toEqual({
      terms: {
        'eventCode.S': MOTION_EVENT_CODES,
      },
    });
  });
});
