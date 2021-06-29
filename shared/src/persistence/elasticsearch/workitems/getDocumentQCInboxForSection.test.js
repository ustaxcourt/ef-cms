const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getDocumentQCInboxForSection,
} = require('./getDocumentQCInboxForSection');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getDocumentQCInboxForSection', () => {
  beforeAll(() => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });
  });

  it('queries the search client for work items with the given section', async () => {
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
                  prefix: { 'pk.S': 'work-item|' },
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
              ],
            },
          },
          size: 1000,
        },
        index: 'efcms-work-item',
      },
    });
  });

  it('queries the search client for work items with the given section and a judgeUserName', async () => {
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
