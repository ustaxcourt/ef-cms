import { fallbackHandler } from './fallbackHandler';

describe('fallbackHandler', () => {
  const mainRegionGet = jest.fn();
  const fallbackRegionGet = jest.fn();
  const mainRegionDocumentClient: any = {
    get: mainRegionGet,
  };
  const fallbackRegionDocumentClient: any = {
    get: fallbackRegionGet,
  };
  it('should not fallback if the first request was successful', async () => {
    mainRegionGet.mockResolvedValue({
      Item: {
        text: 'success',
      },
    });

    await fallbackHandler({
      dynamoMethod: 'get',
      fallbackRegionDocumentClient,
      mainRegionDocumentClient,
    })({
      TableName: 'testing',
    });

    expect(mainRegionGet).toHaveBeenCalledTimes(1);
  });

  it('should fallback if the main dynamodb region is down', async () => {
    mainRegionGet.mockRejectedValue({
      code: 'ResourceNotFoundException',
    });
    fallbackRegionGet.mockResolvedValue({
      Item: {
        text: 'success',
      },
    });

    await fallbackHandler({
      dynamoMethod: 'get',
      fallbackRegionDocumentClient,
      mainRegionDocumentClient,
    })({
      TableName: 'testing',
    });

    expect(mainRegionGet).toHaveBeenCalledTimes(1);
    expect(fallbackRegionGet).toHaveBeenCalledTimes(1);
  });

  it('should fallback if the main dynamodb region is throwing 503 errors', async () => {
    mainRegionGet.mockRejectedValue({
      statusCode: 503,
    });
    fallbackRegionGet.mockResolvedValue({
      Item: {
        text: 'success',
      },
    });

    await fallbackHandler({
      dynamoMethod: 'get',
      fallbackRegionDocumentClient,
      mainRegionDocumentClient,
    })({
      TableName: 'testing',
    });

    expect(mainRegionGet).toHaveBeenCalledTimes(1);
    expect(fallbackRegionGet).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the main dynamodb region is throwing other types of errors', async () => {
    mainRegionGet.mockRejectedValue({
      statusCode: 500,
    });
    fallbackRegionGet.mockResolvedValue({
      Item: {
        text: 'success',
      },
    });

    await expect(
      fallbackHandler({
        dynamoMethod: 'get',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      })({
        TableName: 'testing',
      }),
    ).rejects.toEqual({
      statusCode: 500,
    });

    expect(mainRegionGet).toHaveBeenCalledTimes(1);
    expect(fallbackRegionGet).toHaveBeenCalledTimes(0);
  });
});
