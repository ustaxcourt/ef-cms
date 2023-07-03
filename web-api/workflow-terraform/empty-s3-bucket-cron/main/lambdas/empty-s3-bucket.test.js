const {
  approvePendingJob,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  deleteObjects,
  getNextChunkOfDeleteMarkers,
  getNextChunkOfObjects,
  getNextChunkOfObjectVersions,
} = require('../../../../../shared/admin-tools/aws/s3Helper');
const { handler } = require('./empty-s3-bucket');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../../../../shared/admin-tools/circleci/circleci-helper', () => ({
  approvePendingJob: jest.fn(),
}));
jest.mock('../../../../../shared/admin-tools/aws/s3Helper', () => ({
  deleteObjects: jest.fn(),
  getNextChunkOfDeleteMarkers: jest.fn(),
  getNextChunkOfObjectVersions: jest.fn(),
  getNextChunkOfObjects: jest.fn(),
}));

const mockContext = {
  fail: jest.fn(),
  getRemainingTimeInMillis: jest.fn(),
  succeed: jest.fn(),
};

describe('empty-s3-bucket', () => {
  console.log = () => null;
  console.error = () => null;
  console.time = () => null;
  console.timeEnd = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('approves the workflow immediately if the bucket is already empty', async () => {
    mockContext.getRemainingTimeInMillis.mockReturnValueOnce(875 * 1000);
    getNextChunkOfObjects.mockReturnValueOnce(
      Promise.resolve({ objectsChunk: undefined }),
    );
    getNextChunkOfObjectVersions.mockReturnValueOnce(
      Promise.resolve({ objectVersionsChunk: undefined }),
    );
    getNextChunkOfDeleteMarkers.mockReturnValueOnce(
      Promise.resolve({ deleteMarkersChunk: undefined }),
    );
    await handler({}, mockContext);
    expect(getNextChunkOfObjects).toHaveBeenCalledTimes(1);
    expect(getNextChunkOfObjectVersions).toHaveBeenCalledTimes(1);
    expect(getNextChunkOfDeleteMarkers).toHaveBeenCalledTimes(1);
    expect(approvePendingJob).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      iterations: 1,
    });
  });

  it('takes 7 loop iterations to delete 3 chunks of objects, 2 chunks of object versions, and 1 chunk of delete markers', async () => {
    mockContext.getRemainingTimeInMillis
      .mockReturnValueOnce(875 * 1000)
      .mockReturnValueOnce(750 * 1000)
      .mockReturnValueOnce(700 * 1000)
      .mockReturnValueOnce(690 * 1000)
      .mockReturnValueOnce(650 * 1000)
      .mockReturnValueOnce(620 * 1000)
      .mockReturnValueOnce(500 * 1000);
    getNextChunkOfObjects
      .mockReturnValueOnce(
        Promise.resolve({
          nextContinuationToken: uuidv4(),
          objectsChunk: [
            { Key: uuidv4() },
            { Key: uuidv4() },
            { Key: uuidv4() },
          ],
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          nextContinuationToken: uuidv4(),
          objectsChunk: [
            { Key: uuidv4() },
            { Key: uuidv4() },
            { Key: uuidv4() },
          ],
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          objectsChunk: [{ Key: uuidv4() }],
        }),
      )
      .mockReturnValueOnce(Promise.resolve({ objectsChunk: undefined }))
      .mockReturnValueOnce(Promise.resolve({ objectsChunk: undefined }))
      .mockReturnValueOnce(Promise.resolve({ objectsChunk: undefined }))
      .mockReturnValueOnce(Promise.resolve({ objectsChunk: undefined }));
    getNextChunkOfObjectVersions
      .mockReturnValueOnce(
        Promise.resolve({
          nextKeyMarker: uuidv4(),
          objectVersionsChunk: [
            { Key: uuidv4(), VersionId: uuidv4() },
            { Key: uuidv4(), VersionId: uuidv4() },
            { Key: uuidv4(), VersionId: uuidv4() },
          ],
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          nextKeyMarker: uuidv4(),
          objectVersionsChunk: [{ Key: uuidv4(), VersionId: uuidv4() }],
        }),
      )
      .mockReturnValueOnce(Promise.resolve({ objectVersionsChunk: undefined }))
      .mockReturnValueOnce(Promise.resolve({ objectVersionsChunk: undefined }));
    getNextChunkOfDeleteMarkers
      .mockReturnValueOnce(
        Promise.resolve({
          deleteMarkersChunk: [
            { Key: uuidv4(), VersionId: uuidv4() },
            { Key: uuidv4(), VersionId: uuidv4() },
          ],
        }),
      )
      .mockReturnValueOnce(Promise.resolve({ deleteMarkersChunk: undefined }));
    await handler({}, mockContext);
    expect(getNextChunkOfObjects).toHaveBeenCalledTimes(7);
    expect(getNextChunkOfObjectVersions).toHaveBeenCalledTimes(4);
    expect(getNextChunkOfDeleteMarkers).toHaveBeenCalledTimes(2);
    expect(deleteObjects).toHaveBeenCalledTimes(6);
    expect(approvePendingJob).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      iterations: 7,
    });
  });

  it('does NOT approve the workflow if the lambda runs out of time before everything has been deleted', async () => {
    mockContext.getRemainingTimeInMillis
      .mockReturnValueOnce(875 * 1000)
      .mockReturnValueOnce(1250);
    getNextChunkOfObjects.mockReturnValueOnce(
      Promise.resolve({
        nextContinuationToken: uuidv4(),
        objectsChunk: [{ Key: uuidv4() }, { Key: uuidv4() }, { Key: uuidv4() }],
      }),
    );
    await handler({}, mockContext);
    expect(getNextChunkOfObjects).toHaveBeenCalledTimes(1);
    expect(getNextChunkOfObjectVersions).toHaveBeenCalledTimes(0);
    expect(getNextChunkOfDeleteMarkers).toHaveBeenCalledTimes(0);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      iterations: 1,
    });
  });
});
