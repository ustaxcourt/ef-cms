const { getClient } = require('../../../web-api/elasticsearch/client');
const { isReindexComplete } = require('./check-reindex-complete');
jest.mock('../../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn(),
}));

describe('isReindexComplete', () => {
  const mockEnvName = 'experimental100';
  const count = jest.fn();
  const stats = jest.fn();
  const mockIndices = { count, indices: { stats } };
  console.log = () => null;

  beforeEach(() => {
    getClient.mockReturnValue(mockIndices);
    stats.mockReturnValue({
      body: {
        indices: {
          'efcms-case-deadline': {
            total: {
              translog: { operations: 0 },
            },
          },
          'efcms-message': {
            total: {
              translog: { operations: 0 },
            },
          },
          'efcms-work-item': {
            total: {
              translog: { operations: 0 },
            },
          },
        },
      },
    });
  });

  it('should call getClient with the correct environment and table versions when destination table is alpha', async () => {
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });

    count.mockReturnValueOnce({ body: { count: 9 } });
    count.mockReturnValueOnce({ body: { count: 8 } });
    count.mockReturnValueOnce({ body: { count: 5 } });

    process.env.DESTINATION_TABLE = 'efcms-exp100-alpha';
    await isReindexComplete(mockEnvName);

    expect(getClient.mock.calls[0][0]).toMatchObject({ version: 'beta' });
    expect(getClient.mock.calls[1][0]).toMatchObject({ version: 'alpha' });
  });

  it('should call getClient with the correct environment and table versions when destination table is beta', async () => {
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });

    count.mockReturnValueOnce({ body: { count: 9 } });
    count.mockReturnValueOnce({ body: { count: 8 } });
    count.mockReturnValueOnce({ body: { count: 5 } });

    process.env.DESTINATION_TABLE = 'efcms-exp100-beta';
    await isReindexComplete(mockEnvName);

    expect(getClient.mock.calls[0][0]).toMatchObject({ version: 'alpha' });
    expect(getClient.mock.calls[1][0]).toMatchObject({ version: 'beta' });
  });

  it('should return false when there is a difference in the current and destination index count', async () => {
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });

    count.mockReturnValueOnce({ body: { count: 9 } });
    count.mockReturnValueOnce({ body: { count: 8 } });
    count.mockReturnValueOnce({ body: { count: 5 } });

    const result = await isReindexComplete(mockEnvName);

    expect(result).toBe(false);
  });

  it('should return false when there is no difference in the current and destination index count and elasticsearch is still reindexing', async () => {
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });

    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });

    stats
      .mockReturnValueOnce({
        body: {
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
          },
        },
      })
      .mockReturnValueOnce({
        body: {
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
            'efcms-work-item': {
              total: {
                translog: {
                  operations: 3,
                },
              },
            },
          },
        },
      });

    const result = await isReindexComplete(mockEnvName);

    expect(result).toBe(false);
  });

  it('should return true when there is no difference in the current and destination index count and elasticsearch is finished reindexing', async () => {
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });

    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });
    count.mockReturnValueOnce({ body: { count: 3 } });

    stats
      .mockReturnValueOnce({
        body: {
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
          },
        },
      })
      .mockReturnValueOnce({
        body: {
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
            'efcms-work-item': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
          },
        },
      });

    const result = await isReindexComplete(mockEnvName);

    expect(result).toBe(true);
  });
});
