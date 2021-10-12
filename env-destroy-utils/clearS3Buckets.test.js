const { clearS3Buckets } = require('./clearS3Buckets');
const { getS3Buckets } = require('./getS3Buckets');
jest.mock('./getS3Buckets', () => ({
  getS3Buckets: jest.fn(),
}));
const { getS3 } = require('./getS3');
jest.mock('./getS3', () => ({
  getS3: jest.fn(),
}));

describe('clearS3Buckets', () => {
  const mockEnv = { region: 'test' };

  it('should retrieve all s3 buckets for the specified env', async () => {
    getS3Buckets.mockResolvedValue([]);

    await clearS3Buckets({ environment: mockEnv });

    expect(getS3Buckets.mock.calls[0][0]).toMatchObject({
      environment: mockEnv,
    });
  });

  it('should delete all items from each s3 bucket when there is a bucket that has more than 1000 keys', async () => {
    const mockDeleteObjects = jest.fn().mockReturnValue({ promise: () => {} });
    const mockListObjects = jest
      .fn()
      .mockReturnValueOnce({
        promise: () => ({
          Contents: [...Array(1000).keys()],
        }),
      })
      .mockReturnValueOnce({
        promise: () => ({
          Contents: [...Array(1000).keys()],
        }),
      })
      .mockReturnValueOnce({
        promise: () => ({
          Contents: [...Array(100).keys()],
        }),
      })
      .mockReturnValueOnce({
        promise: () => ({
          Contents: [],
        }),
      });
    const mockListObjectVersions = jest.fn().mockReturnValueOnce({
      promise: () => ({
        Versions: [],
      }),
    });
    getS3.mockReturnValueOnce({
      deleteObjects: mockDeleteObjects,
      listObjectVersions: mockListObjectVersions,
      listObjects: mockListObjects,
    });
    getS3Buckets.mockResolvedValue([{ Name: 'First Bucket' }]);

    await clearS3Buckets({ environment: mockEnv });

    expect(mockDeleteObjects).toHaveBeenCalledTimes(3);
  });

  it('should delete all object versions from each s3 bucket when there is a bucket that has more than object version 1000 keys', async () => {
    const mockDeleteObjects = jest.fn().mockReturnValue({ promise: () => {} });
    const mockListObjects = jest.fn().mockReturnValueOnce({
      promise: () => ({
        Contents: [],
      }),
    });
    const mockListObjectVersions = jest
      .fn()
      .mockReturnValueOnce({
        promise: () => ({
          Versions: [...Array(1000).keys()],
        }),
      })
      .mockReturnValueOnce({
        promise: () => ({
          Versions: [...Array(1000).keys()],
        }),
      })
      .mockReturnValueOnce({
        promise: () => ({
          Versions: [...Array(100).keys()],
        }),
      })
      .mockReturnValueOnce({
        promise: () => ({
          Versions: [],
        }),
      });
    getS3.mockReturnValueOnce({
      deleteObjects: mockDeleteObjects,
      listObjectVersions: mockListObjectVersions,
      listObjects: mockListObjects,
    });
    getS3Buckets.mockResolvedValue([{ Name: 'First Bucket' }]);

    await clearS3Buckets({ environment: mockEnv });

    expect(mockDeleteObjects).toHaveBeenCalledTimes(3);
  });

  it('should not throw an error when a s3 bucket does not have any objects or versions', async () => {
    const mockDeleteObjects = jest.fn().mockReturnValue({ promise: () => {} });
    const mockListObjects = jest.fn().mockReturnValueOnce({
      promise: () => ({
        Contents: [],
      }),
    });
    const mockListObjectVersions = jest.fn().mockReturnValueOnce({
      promise: () => ({
        Versions: [],
      }),
    });
    getS3.mockReturnValueOnce({
      deleteObjects: mockDeleteObjects,
      listObjectVersions: mockListObjectVersions,
      listObjects: mockListObjects,
    });
    getS3Buckets.mockResolvedValue([{ Name: 'First Bucket' }]);

    await clearS3Buckets({ environment: mockEnv });

    expect(mockDeleteObjects).not.toHaveBeenCalled();
  });
});
