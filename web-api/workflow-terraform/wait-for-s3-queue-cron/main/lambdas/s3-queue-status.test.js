const {
  approvePendingJob,
  cancelWorkflow,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  countItemsInQueue,
} = require('../../../../../shared/admin-tools/aws/sqsHelper');
const {
  getItem,
  putItem,
} = require('../../../../../shared/admin-tools/aws/deployTableHelper');
const { handler } = require('./s3-bucket-sync-status');

jest.mock('../../../../../shared/admin-tools/circleci/circleci-helper', () => ({
  approvePendingJob: jest.fn(),
  cancelWorkflow: jest.fn(),
}));
jest.mock('../../../../../shared/admin-tools/aws/sqsHelper', () => ({
  countItemsInQueue: jest.fn(),
}));
jest.mock('../../../../../shared/admin-tools/aws/deployTableHelper', () => ({
  getItem: jest.fn(),
  putItem: jest.fn(),
}));

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
};

describe('s3-bucket-sync-status', () => {
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
      s3BucketSyncDlQueueCount: -1,
    });
  });

  it('should call cancelWorkflow when the DL queue is NOT empty', async () => {
    countItemsInQueue.mockReturnValueOnce(Promise.resolve(1));
    await handler({}, mockContext);
    expect(approvePendingJob).not.toHaveBeenCalled();
    expect(cancelWorkflow).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3BucketSyncDlQueueCount: 1,
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
      s3BucketSyncDlQueueCount: 0,
      s3BucketSyncQueueCount: -1,
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
      s3BucketSyncDlQueueCount: 0,
      s3BucketSyncQueueCount: 55,
    });
  });

  it('should NOT call approvePendingJob the first time the S3 bucket sync queue is empty', async () => {
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
      key: 's3-bucket-sync-queue-is-not-empty',
      value: true,
    });
    expect(mockContext.succeed).toHaveBeenCalledWith({
      s3BucketSyncDlQueueCount: 0,
      s3BucketSyncQueueCount: 0,
      s3BucketSyncQueueIsEmptyFlag: false,
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
      s3BucketSyncDlQueueCount: 0,
      s3BucketSyncQueueCount: 0,
      s3BucketSyncQueueIsEmptyFlag: true,
    });
  });
});
