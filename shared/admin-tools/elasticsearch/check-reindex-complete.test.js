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

  it('should call getClient with the correct environment and table versions when destination table is alpha', async () => {
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

    process.env.DESTINATION_TABLE = 'efcms-exp100-alpha';
    await isReindexComplete(mockEnvName);

    expect(getClient.mock.calls[0][0]).toMatchObject({ version: 'beta' });
    expect(getClient.mock.calls[1][0]).toMatchObject({ version: 'alpha' });
  });

  it('should call getClient with the correct environment and table versions when destination table is beta', async () => {
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

    process.env.DESTINATION_TABLE = 'efcms-exp100-beta';
    await isReindexComplete(mockEnvName);

    expect(getClient.mock.calls[0][0]).toMatchObject({ version: 'alpha' });
    expect(getClient.mock.calls[1][0]).toMatchObject({ version: 'beta' });
  });

  it('should return false when there is a difference in the current and destination index count', async () => {
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

  it('should return false when there is no difference in the current and destination index count and elasticsearch is still reindexing', async () => {
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
          'efcms-case-deadline': {
            total: {
              translog: {
                operations: 3,
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
          'efcms-message': {
            total: {
              translog: {
                operations: 3,
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
          'efcms-work-item': {
            total: {
              translog: {
                operations: 3,
              },
            },
          },
        },
      });

    const result = await isReindexComplete(mockEnvName);

    expect(result).toBe(false);
  });

  it('should return true when there is no difference in the current and destination index count and elasticsearch is finished reindexing', async () => {
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
          'efcms-case-deadline': {
            total: {
              translog: {
                operations: 0,
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
          'efcms-message': {
            total: {
              translog: {
                operations: 0,
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
          'efcms-work-item': {
            total: {
              translog: {
                operations: 0,
              },
            },
          },
        },
      });

    const result = await isReindexComplete(mockEnvName);

    expect(result).toBe(true);
  });
});
