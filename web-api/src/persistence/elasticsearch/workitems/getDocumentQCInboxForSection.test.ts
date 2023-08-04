import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCInboxForSection } from './getDocumentQCInboxForSection';
jest.mock('../searchClient');
import { GET_PARENT_CASE } from '../helpers/searchClauses';
import { search } from '../searchClient';

describe('getDocumentQCInboxForSection', () => {
  beforeAll(() => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });
  });

  it('should return work items with the given section', async () => {
    await getDocumentQCInboxForSection({
      applicationContext,
      section: 'docket',
    });

    expect(search).toHaveBeenCalledWith({
      applicationContext,
      searchParameters: {
        body: {
          query: {
            bool: {
              must: [
                {
                  prefix: { 'pk.S': 'case|' },
                },
                {
                  prefix: { 'sk.S': 'work-item|' },
                },
                {
                  term: {
                    'section.S': 'docket',
                  },
                },
              ],
              must_not: {
                exists: {
                  field: 'completedAt.S',
                },
              },
              should: [
                {
                  term: {
                    'highPriority.BOOL': {
                      boost: 500,
                      value: true,
                    },
                  },
                },
                GET_PARENT_CASE,
              ],
            },
          },
          size: 5000,
        },
        index: 'efcms-work-item',
      },
    });
  });

  it('should return work items with the given section and a judgeUserName', async () => {
    const mockJudgeName = 'Ashford';
    await getDocumentQCInboxForSection({
      applicationContext,
      judgeUserName: mockJudgeName,
      section: 'docket',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must[3],
    ).toEqual({
      match: {
        'associatedJudge.S': mockJudgeName,
      },
    });
  });
});
