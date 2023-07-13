const {
  addToQueue,
  countItemsInQueue,
} = require('../../../../../shared/admin-tools/aws/sqsHelper');
const {
  approvePendingJob,
  cancelWorkflow,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  generateBucketTruncationQueueEntries,
} = require('../../../process-s3-queue/main/utilities/generate-truncation-queue');
const {
  getItem,
  putItem,
} = require('../../../../../shared/admin-tools/aws/deployTableHelper');
const { handler } = require('./s3-queue-status');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../../../../shared/admin-tools/circleci/circleci-helper', () => ({
  approvePendingJob: jest.fn(),
  cancelWorkflow: jest.fn(),
}));
jest.mock('../../../../../shared/admin-tools/aws/sqsHelper', () => ({
  addToQueue: jest.fn(),
  countItemsInQueue: jest.fn(),
}));
jest.mock(
  '../../../process-s3-queue/main/utilities/generate-truncation-queue',
  () => ({
    generateBucketTruncationQueueEntries: jest.fn(),
  }),
);
jest.mock('../../../../../shared/admin-tools/aws/deployTableHelper', () => ({
  getItem: jest.fn(),
  putItem: jest.fn(),
}));

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
};

describe('s3-queue-status', () => {
  console.log = () => null;
  console.error = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return immediately if it can't count the items in the DL queue", async () => {
    countItemsInQueue.mockReturnValueOnce(Promise.resolve(-1));
    await handler({}, mockContext);
    expect(approvePendingJob).not.toHaveBeenCalled();
    expect(cancelWorkflow).not.toHaveBeenCalled();
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3DlQueueCount: -1,
    });
  });

  it('should call cancelWorkflow when the DL queue is NOT empty', async () => {
    countItemsInQueue.mockReturnValueOnce(Promise.resolve(1));
    await handler({}, mockContext);
    expect(approvePendingJob).not.toHaveBeenCalled();
    expect(cancelWorkflow).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3DlQueueCount: 1,
    });
  });

  it("should return if it can't count the items in the S3 bucket sync queue", async () => {
    countItemsInQueue
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(-1)); // S3 bucket sync queue count
    await handler({}, mockContext);
    expect(approvePendingJob).not.toHaveBeenCalled();
    expect(cancelWorkflow).not.toHaveBeenCalled();
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3DlQueueCount: 0,
      s3QueueCount: -1,
    });
  });

  it('should NOT call approvePendingJob when the S3 bucket sync queue is NOT empty', async () => {
    countItemsInQueue
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(55)); // S3 bucket sync queue count
    await handler({}, mockContext);
    expect(approvePendingJob).not.toHaveBeenCalled();
    expect(cancelWorkflow).not.toHaveBeenCalled();
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3DlQueueCount: 0,
      s3QueueCount: 55,
    });
  });

  it('should check for delete markers to delete and add them to the queue', async () => {
    process.env.EMPTYING_BUCKET = '1';
    countItemsInQueue
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)) // S3 bucket sync queue count
      .mockReturnValueOnce(Promise.resolve(1)); // S3 bucket sync queue count
    generateBucketTruncationQueueEntries.mockReturnValueOnce([
      {
        Bucket: 'jest-bucket',
        Objects: [
          { Key: uuidv4() },
          { Key: uuidv4() },
          { Key: uuidv4() },
          { Key: uuidv4() },
        ],
        action: 'DELETE',
      },
    ]);
    await handler({}, mockContext);
    expect(countItemsInQueue).toHaveBeenCalledTimes(3);
    expect(approvePendingJob).not.toHaveBeenCalled();
    expect(cancelWorkflow).not.toHaveBeenCalled();
    expect(addToQueue).toHaveBeenCalledTimes(1);
    expect(putItem).toHaveBeenCalledTimes(1);
    expect(putItem).toHaveBeenCalledWith({
      env: undefined,
      key: 's3-queue-is-empty',
      value: false,
    });
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3DlQueueCount: 0,
      s3QueueCount: 1,
    });
  });

  it('should NOT call approvePendingJob the first time the S3 bucket sync queue is empty', async () => {
    process.env.EMPTYING_BUCKET = '0';
    countItemsInQueue
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // S3 bucket sync queue count
    getItem.mockReturnValueOnce(Promise.resolve(false));
    await handler({}, mockContext);
    expect(approvePendingJob).not.toHaveBeenCalled();
    expect(cancelWorkflow).not.toHaveBeenCalled();
    expect(getItem).toHaveBeenCalledTimes(1);
    expect(putItem).toHaveBeenCalledTimes(1);
    expect(putItem).toHaveBeenCalledWith({
      env: undefined,
      key: 's3-queue-is-empty',
      value: true,
    });
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3DlQueueCount: 0,
      s3QueueCount: 0,
      s3QueueIsEmptyFlag: false,
    });
  });

  it('should call approvePendingJob the second consecutive time the S3 bucket sync queue is empty', async () => {
    countItemsInQueue
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // S3 bucket sync queue count
    getItem.mockReturnValueOnce(Promise.resolve(true));
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(1);
    expect(cancelWorkflow).not.toHaveBeenCalled();
    expect(getItem).toHaveBeenCalledTimes(1);
    expect(putItem).not.toHaveBeenCalled();
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3DlQueueCount: 0,
      s3QueueCount: 0,
      s3QueueIsEmptyFlag: true,
    });
  });
});
