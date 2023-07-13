const {
  addToQueue,
} = require('../../../../../shared/admin-tools/aws/sqsHelper');
const {
  copyObjects,
  deleteObjects,
} = require('../../../../../shared/admin-tools/aws/s3Helper');
const { handler } = require('./sync-s3-buckets');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../../../../shared/admin-tools/aws/sqsHelper', () => ({
  addToQueue: jest.fn(),
}));
jest.mock('../../../../../shared/admin-tools/aws/s3Helper', () => ({
  copyObjects: jest.fn(),
  deleteObjects: jest.fn(),
}));

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
};

describe('sync-s3-buckets', () => {
  console.log = () => null;
  console.error = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns immediately if the event can not be processed', async () => {
    await handler({}, mockContext);
    expect(deleteObjects).not.toHaveBeenCalled();
    expect(copyObjects).not.toHaveBeenCalled();
  });

  it('copies the specified objects from the source bucket to the destination bucket', async () => {
    const mockEvent = {
      Objects: [
        { Key: uuidv4(), VersionId: uuidv4() },
        { Key: uuidv4(), VersionId: uuidv4() },
        { Key: uuidv4(), VersionId: uuidv4() },
      ],
      action: 'COPY',
      destinationBucket: 'destination-bucket',
      sourceBucket: 'source-bucket',
    };

    await handler(mockEvent, mockContext);
    expect(deleteObjects).not.toHaveBeenCalled();
    expect(copyObjects).toHaveBeenCalledTimes(1);
  });

  it('deletes the specified objects from the specified bucket', async () => {
    const mockEvent = {
      Bucket: 'destination-bucket',
      Objects: [{ Key: uuidv4() }, { Key: uuidv4() }, { Key: uuidv4() }],
      action: 'DELETE',
    };

    await handler(mockEvent, mockContext);
    expect(deleteObjects).toHaveBeenCalledTimes(1);
    expect(copyObjects).not.toHaveBeenCalled();
  });

  it('adds the event to the dead letter queue if an error is returned', async () => {
    const Key = uuidv4();
    const VersionId = uuidv4();
    const mockEvent = {
      Objects: [{ Key, VersionId }],
      action: 'COPY',
      destinationBucket: 'destination-bucket',
      sourceBucket: 'source-bucket',
    };
    const mockResponse = {
      Copied: undefined,
      Errors: [{ Code: 'SlowDown', Key, VersionId }],
    };
    copyObjects.mockReturnValueOnce(Promise.resolve(mockResponse));

    await handler(mockEvent, mockContext);
    expect(deleteObjects).not.toHaveBeenCalled();
    expect(copyObjects).toHaveBeenCalledTimes(1);
    expect(addToQueue).toHaveBeenCalledTimes(1);
  });
});
