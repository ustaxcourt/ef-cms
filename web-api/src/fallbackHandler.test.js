const { fallbackHandler } = require('./fallbackHandler');

const mockGet = jest.fn();

jest.mock('./getDynamoEndpoints', () => {
  return {
    getDynamoEndpoints: () => ({
      fallbackRegionDB: {
        get: mockGet,
      },
      mainRegionDB: {
        get: mockGet,
      },
    }),
  };
});

describe('fallbackHandler', () => {
  it('should not fallback if the first request was successful', async () => {
    mockGet.mockResolvedValue({
      Item: {
        text: 'success',
      },
    });

    await fallbackHandler({
      key: 'get',
    })({
      TableName: 'testing',
    }).promise();
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('should fallback if the main dynamodb region is down', async () => {
    mockGet.mockRejectedValueOnce({
      code: 'ResourceNotFoundException',
    });

    mockGet.mockResolvedValueOnce({
      Item: {
        text: 'success',
      },
    });

    await fallbackHandler({
      key: 'get',
    })({
      TableName: 'testing',
    }).promise();
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('should fallback if the main dynamodb region is throwing 503 errors', async () => {
    mockGet.mockRejectedValueOnce({
      statusCode: 503,
    });

    mockGet.mockResolvedValueOnce({
      Item: {
        text: 'success',
      },
    });

    await fallbackHandler({
      key: 'get',
    })({
      TableName: 'testing',
    }).promise();
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if the main dynamodb region is throwing other types of errors', async () => {
    mockGet.mockRejectedValueOnce({
      statusCode: 500,
    });

    mockGet.mockRejectedValueOnce({});

    await expect(
      fallbackHandler({
        key: 'get',
      })({
        TableName: 'testing',
      }).promise(),
    ).rejects.toEqual({ statusCode: 500 });
  });
});
