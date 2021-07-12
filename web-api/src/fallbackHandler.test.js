const { fallbackHandler } = require('./fallbackHandler');

const mockGet = jest.fn();

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        get: mockGet,
      })),
    },
  };
});

describe('fallbackHandler', () => {
  it('should not fallback if the first request was successful', async () => {
    mockGet.mockImplementationOnce(() => ({
      promise: () =>
        Promise.resolve({
          Item: {
            text: 'success',
          },
        }),
    }));

    await fallbackHandler({
      key: 'get',
    })({
      TableName: 'testing',
    }).promise();
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('should fallback if the main dynamodb region is down', async () => {
    mockGet.mockImplementationOnce(() => ({
      promise: () =>
        Promise.reject({
          code: 'ResourceNotFoundException',
        }),
    }));

    mockGet.mockImplementationOnce(() => ({
      promise: () =>
        Promise.resolve({
          Item: {
            text: 'success',
          },
        }),
    }));

    await fallbackHandler({
      key: 'get',
    })({
      TableName: 'testing',
    }).promise();
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('should fallback if the main dynamodb region is throwing 503 errors', async () => {
    mockGet.mockImplementationOnce(() => ({
      promise: () =>
        Promise.reject({
          statusCode: 503,
        }),
    }));

    mockGet.mockImplementationOnce(() => ({
      promise: () =>
        Promise.resolve({
          Item: {
            text: 'success',
          },
        }),
    }));

    await fallbackHandler({
      key: 'get',
    })({
      TableName: 'testing',
    }).promise();
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if the main dynamodb region is throwing other types of errors', async () => {
    mockGet.mockImplementationOnce(() => ({
      promise: () =>
        Promise.reject({
          statusCode: 500,
        }),
    }));

    mockGet.mockImplementationOnce(() => ({
      promise: () => Promise.reject({}),
    }));

    await expect(
      fallbackHandler({
        key: 'get',
      })({
        TableName: 'testing',
      }).promise(),
    ).rejects.toEqual({ statusCode: 500 });
  });
});
