const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getDocumentQCInboxForUser } = require('./getDocumentQCInboxForUser');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getDocumentQCInboxForUser', () => {
  beforeAll(() => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });
  });

  it('queries the search client for work items with the given userId', async () => {
    await getDocumentQCInboxForUser({ applicationContext, userId: '123' });

    expect(search).toHaveBeenCalledWith({
      applicationContext,
      searchParameters: {
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    'pk.S': 'user|123',
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
