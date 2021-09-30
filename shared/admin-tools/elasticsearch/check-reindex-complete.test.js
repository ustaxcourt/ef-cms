const { getClient } = require('../../../web-api/elasticsearch/client');
const { isReindexComplete } = require('./check-reindex-complete');
jest.mock('../../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn(),
}));

describe('isReindexComplete', () => {
  const mockEnvName = 'experimental100';
  const stats = jest.fn();
  const mockIndices = { indices: { stats } };
  console.log = () => null;

  beforeEach(() => {
    getClient.mockReturnValue(mockIndices);
  });

  it('is false when there is a difference in the current and destination index count', async () => {
    stats.mockReturnValueOnce({
      indices: {
        'efcms-case': {
          total: {
            docs: {
              count: 3,
            },
          },
        },
        'efcms-docket-entry': {
          total: {
            docs: {
              count: 3,
            },
          },
        },
        'efcms-user': {
          total: {
            docs: {
              count: 3,
            },
          },
        },
        'efcms-user-case': {
          total: {
            docs: {
              count: 3,
            },
          },
        },
      },
    });
    stats.mockReturnValueOnce({
      indices: {
        'efcms-case': {
          total: {
            docs: {
              count: 9,
            },
          },
        },
        'efcms-docket-entry': {
          total: {
            docs: {
              count: 8,
            },
          },
        },
        'efcms-user': {
          total: {
            docs: {
              count: 5,
            },
          },
        },
        'efcms-user-case': {
          total: {
            docs: {
              count: 0,
            },
          },
        },
      },
    });

    const result = await isReindexComplete(mockEnvName);

    expect(result).toBe(false);
  });

  it('is false when there is no difference in the current and destination index count and elasticsearch is still reindexing', async () => {
    stats
      .mockReturnValueOnce({
        indices: {
          'efcms-case': {
            total: {
              docs: {
                count: 3,
              },
            },
          },
          'efcms-docket-entry': {
            total: {
              docs: {
                count: 3,
              },
            },
          },
          'efcms-user': {
            total: {
              docs: {
                count: 3,
              },
            },
          },
          'efcms-user-case': {
            total: {
              docs: {
                count: 3,
              },
              translog: {
                operations: 9,
              },
            },
          },
        },
      })
      .mockReturnValueOnce({
        indices: {
          'efcms-case': {
            total: {
              docs: {
                count: 3,
              },
            },
          },
          'efcms-docket-entry': {
            total: {
              docs: {
                count: 3,
              },
            },
          },
          'efcms-user': {
            total: {
              docs: {
                count: 3,
              },
            },
          },
          'efcms-user-case': {
            total: {
              docs: {
                count: 3,
              },
            },
          },
        },
      });

    const result = await isReindexComplete(mockEnvName);

    expect(result).toBe(false);
  });
});
