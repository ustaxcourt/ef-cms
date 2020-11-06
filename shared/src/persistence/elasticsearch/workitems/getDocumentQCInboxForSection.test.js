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
                  match: {
                    'pk.S': 'section|docket',
                  },
                },
                {
                  match: {
                    'sk.S': 'work-item|',
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
});
