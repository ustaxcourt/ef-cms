const {
  approvePendingJob,
  cancelWorkflow,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  getMetricStatistics,
  getMigrationQueueIsEmptyFlag,
  getSqsQueueCount,
  putMigrationQueueIsEmptyFlag,
} = require('../../../../../shared/admin-tools/aws/migrationWaitHelper');
const { handler } = require('./migration-status');

jest.mock('../../../../../shared/admin-tools/circleci/circleci-helper', () => ({
  approvePendingJob: jest.fn(),
  cancelWorkflow: jest.fn(),
}));
jest.mock('../../../../../shared/admin-tools/aws/migrationWaitHelper', () => ({
  getMetricStatistics: jest.fn(),
  getMigrationQueueIsEmptyFlag: jest.fn(),
  getSqsQueueCount: jest.fn(),
  putMigrationQueueIsEmptyFlag: jest.fn(),
}));

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
};
const mockErrorStatistics = {
  Datapoints: [
    {
      Sum: 4,
      Unit: 'Count',
    },
  ],
  Label: 'Errors',
};
const mockInvocationStatistics = {
  Datapoints: [
    {
      Sum: 5,
      Unit: 'Count',
    },
  ],
  Label: 'Invocations',
};

describe('migration-status', () => {
  console.log = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call approvePendingJob when MIGRATE_FLAG is false', async () => {
    process.env.MIGRATE_FLAG = 'false';
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(1);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(0);
    expect(getMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(0);
    expect(putMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      migrateFlag: 'false',
      shouldCancel: false,
      shouldProceed: true,
    });
  });

  it('should call cancelWorkflow when the error rate is above 50%', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics)) // errors
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics)); // invocations
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(55)); // migration segment queue
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(1);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(2);
    expect(putMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(mockContext.fail).toHaveBeenCalledWith({
      dlQueueCount: 0,
      errorRate: 80,
      migrateFlag: 'true',
      shouldCancel: true,
      shouldProceed: false,
      totalActiveJobs: 55,
    });
  });

  it('should call cancelWorkflow when the DL queue is NOT empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    mockErrorStatistics.Datapoints[0].Sum = 0;
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics)) // errors
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics)); // invocations
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(2)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(55)); // migration segment queue
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(1);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(2);
    expect(putMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(mockContext.fail).toHaveBeenCalledWith({
      dlQueueCount: 2,
      errorRate: 0,
      migrateFlag: 'true',
      shouldCancel: true,
      shouldProceed: false,
      totalActiveJobs: 55,
    });
  });

  it('should NOT call approvePendingJob when the migration segment queue is NOT empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    mockErrorStatistics.Datapoints[0].Sum = 0;
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics)) // errors
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics)); // invocations
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(55)); // migration segment queue
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(2);
    expect(putMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: 0,
      errorRate: 0,
      migrateFlag: 'true',
      shouldCancel: false,
      shouldProceed: false,
      totalActiveJobs: 55,
    });
  });

  it('should NOT call approvePendingJob the first time the migration segment queue is empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    mockErrorStatistics.Datapoints[0].Sum = 0;
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics)) // errors
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics)); // invocations
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // migration segment queue
    getMigrationQueueIsEmptyFlag.mockReturnValueOnce(Promise.resolve(false));
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(1);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(2);
    expect(putMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: 0,
      errorRate: 0,
      migrateFlag: 'true',
      migrationQueueIsEmptyFlag: false,
      shouldCancel: false,
      shouldProceed: false,
      totalActiveJobs: 0,
    });
  });

  it('should call approvePendingJob the second consecutive time the migration segment queue is empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    mockErrorStatistics.Datapoints[0].Sum = 0;
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics)) // errors
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics)); // invocations
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // migration segment queue
    getMigrationQueueIsEmptyFlag.mockReturnValueOnce(Promise.resolve(true));
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(1);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(1);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(2);
    expect(putMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: 0,
      errorRate: 0,
      migrateFlag: 'true',
      migrationQueueIsEmptyFlag: true,
      shouldCancel: false,
      shouldProceed: true,
      totalActiveJobs: 0,
    });
  });
});
