import { clearS3Buckets } from './clearS3Buckets';
import { getS3 } from './getS3';
import { getS3Buckets } from './getS3Buckets';
jest.mock('./getS3Buckets', () => ({
  getS3Buckets: jest.fn().mockResolvedValue([]),
}));
jest.mock('./getS3', () => ({
  getS3: jest.fn().mockResolvedValue({
    deleteObjects: jest.fn(),
    listObjectVersions: jest.fn(),
    listObjectsV2: jest.fn(),
  }),
}));

describe('clearS3Buckets', () => {
  const mockEnv = { name: 'jest', region: 'test' };

  it('should retrieve all s3 buckets for the specified env', async () => {
    (getS3Buckets as jest.Mock).mockResolvedValue([]);

    await clearS3Buckets({ environment: mockEnv });

    expect((getS3Buckets as jest.Mock).mock.calls[0][0]).toMatchObject({
      environment: mockEnv,
    });
  });

  it('should delete all items from each s3 bucket when there is a bucket that has more than 1000 keys', async () => {
    const mockDeleteObjects = jest.fn().mockResolvedValue({});
    const mockListObjects = jest
      .fn()
      .mockResolvedValueOnce({
        Contents: [...Array(1000).keys()],
      })
      .mockResolvedValueOnce({
        Contents: [...Array(1000).keys()],
      })
      .mockResolvedValueOnce({
        Contents: [...Array(100).keys()],
      })
      .mockResolvedValueOnce({
        Contents: [],
      });
    const mockListObjectVersions = jest
      .fn()
      .mockResolvedValueOnce({
        Versions: [],
      })
      .mockResolvedValueOnce({
        DeleteMarkers: [],
      });
    (getS3 as jest.Mock).mockReturnValueOnce({
      deleteObjects: mockDeleteObjects,
      listObjectVersions: mockListObjectVersions,
      listObjectsV2: mockListObjects,
    });
    (getS3Buckets as jest.Mock).mockResolvedValue([{ Name: 'First Bucket' }]);

    await clearS3Buckets({ environment: mockEnv });

    expect(mockDeleteObjects).toHaveBeenCalledTimes(3);
  });

  it('should delete all object versions from each s3 bucket when there is a bucket that has more than 1000 object versions', async () => {
    const mockDeleteObjects = jest.fn().mockResolvedValue({});
    const mockListObjects = jest.fn().mockResolvedValueOnce({
      Contents: [],
    });
    const mockListObjectVersions = jest
      .fn()
      .mockResolvedValueOnce({
        Versions: [...Array(1000).keys()],
      })
      .mockResolvedValueOnce({
        Versions: [...Array(1000).keys()],
      })
      .mockResolvedValueOnce({
        Versions: [...Array(100).keys()],
      })
      .mockResolvedValueOnce({
        Versions: [],
      })
      .mockResolvedValueOnce({
        DeleteMarkers: [],
      });
    (getS3 as jest.Mock).mockReturnValueOnce({
      deleteObjects: mockDeleteObjects,
      listObjectVersions: mockListObjectVersions,
      listObjectsV2: mockListObjects,
    });
    (getS3Buckets as jest.Mock).mockResolvedValue([{ Name: 'First Bucket' }]);

    await clearS3Buckets({ environment: mockEnv });

    expect(mockDeleteObjects).toHaveBeenCalledTimes(3);
  });

  it('should not throw an error when a s3 bucket does not have any objects or versions', async () => {
    const mockDeleteObjects = jest.fn().mockResolvedValue({});
    const mockListObjects = jest.fn().mockResolvedValueOnce({
      Contents: [],
    });
    const mockListObjectVersions = jest
      .fn()
      .mockResolvedValueOnce({
        Versions: [],
      })
      .mockResolvedValueOnce({
        DeleteMarkers: [],
      });
    (getS3 as jest.Mock).mockReturnValueOnce({
      deleteObjects: mockDeleteObjects,
      listObjectVersions: mockListObjectVersions,
      listObjectsV2: mockListObjects,
    });
    (getS3Buckets as jest.Mock).mockResolvedValue([{ Name: 'First Bucket' }]);

    await clearS3Buckets({ environment: mockEnv });

    expect(mockDeleteObjects).not.toHaveBeenCalled();
  });
});
