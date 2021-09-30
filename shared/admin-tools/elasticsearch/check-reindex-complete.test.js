const { getClient } = require('../../../web-api/elasticsearch/client');
const { isReindexComplete } = require('./check-reindex-complete');
jest.mock('../../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn(),
}));

describe('isReindexComplete', () => {
  const mockEnvName = 'experimental100';
  const stats = jest.fn();
  const mockIndices = { indices: { stats } };

  beforeEach(() => {
    getClient.mockReturnValue(mockIndices);
  });

  it('is false when there is a difference in the current and destination index count', async () => {
    stats.mockReturnValueOnce({
      indices: {
        'efcms-docket-entry': {
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
        'efcms-docket-entry': {
          total: {
            docs: {
              count: 8,
            },
          },
        },
      },
    });

    const result = isReindexComplete(mockEnvName);

    expect(result).toBe(false);
  });
});
