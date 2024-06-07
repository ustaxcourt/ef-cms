import * as circleHelper from '../../../../shared/admin-tools/circleci/circleci-helper';
import * as migrationWaitHelper from '../../../../shared/admin-tools/aws/migrationWaitHelper';
import { handler } from './migration-status';
import type { Context } from 'aws-lambda';
import type { GetMetricStatisticsOutput } from '@aws-sdk/client-cloudwatch';

jest.mock('../../../../shared/admin-tools/circleci/circleci-helper');
const approvePendingJob = jest
  .spyOn(circleHelper, 'approvePendingJob')
  .mockImplementation(jest.fn());
const cancelWorkflow = jest
  .spyOn(circleHelper, 'cancelWorkflow')
  .mockImplementation(jest.fn());

jest.mock('../../../../shared/admin-tools/aws/migrationWaitHelper');
const getMetricStatistics = jest
  .spyOn(migrationWaitHelper, 'getMetricStatistics')
  .mockImplementation(jest.fn());
const getMigrationQueueIsEmptyFlag = jest
  .spyOn(migrationWaitHelper, 'getMigrationQueueIsEmptyFlag')
  .mockImplementation(jest.fn());
const getSqsQueueCount = jest
  .spyOn(migrationWaitHelper, 'getSqsQueueCount')
  .mockImplementation(jest.fn());
const putMigrationQueueIsEmptyFlag = jest
  .spyOn(migrationWaitHelper, 'putMigrationQueueIsEmptyFlag')
  .mockImplementation(jest.fn());

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
} as unknown as Context;
const mockErrorStatistics: GetMetricStatisticsOutput = {
  Datapoints: [
    {
      Sum: 0,
      Unit: 'Count',
    },
  ],
  Label: 'Errors',
};
const mockInvocationStatistics: GetMetricStatisticsOutput = {
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
  console.error = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call approvePendingJob when MIGRATE_FLAG is false', async () => {
    process.env.MIGRATE_FLAG = 'false';
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(1);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      migrateFlag: 'false',
    });
  });

  it('should call cancelWorkflow when the error rate is above 50%', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(
        Promise.resolve({
          Datapoints: [
            {
              Sum: 4,
              Unit: 'Count',
            },
          ],
          Label: 'Errors',
        }),
      )
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics));
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(1);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      errorRate: 80,
      migrateFlag: 'true',
    });
  });

  it('should call cancelWorkflow when the DL queue is NOT empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics));
    getSqsQueueCount.mockReturnValueOnce(Promise.resolve(2)); // DL queue count
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(1);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: 2,
      errorRate: 0,
      migrateFlag: 'true',
    });
  });

  it('should NOT call approvePendingJob when the migration segment queue is NOT empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics));
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(55)); // migration segment queue count
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(0);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(2);
    expect(putMigrationQueueIsEmptyFlag).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledTimes(1);
  });

  it('should NOT call approvePendingJob the first time the migration segment queue is empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics));
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // migration segment queue count
    getMigrationQueueIsEmptyFlag.mockReturnValueOnce(Promise.resolve(false));
    await handler({}, mockContext, () => {});
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
      totalActiveJobs: 0,
    });
  });

  it('should call approvePendingJob the second consecutive time the migration segment queue is empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics));
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // migration segment queue count
    getMigrationQueueIsEmptyFlag.mockReturnValueOnce(Promise.resolve(true));
    await handler({}, mockContext, () => {});
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
      totalActiveJobs: 0,
    });
  });

  it('should fail fast on any error when getting metrics statistics for errors', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics.mockReturnValueOnce(Promise.reject()); // error statistics
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      errorRate: -1,
      migrateFlag: 'true',
    });
  });

  it('should fail fast on any error when getting metrics statistics for invocations', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(Promise.reject()); // invocation statistics
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      errorRate: -1,
      migrateFlag: 'true',
    });
  });

  it('should fail fast on any error when getting the number of items in the migration segments dead letter queue', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics));
    getSqsQueueCount.mockReturnValueOnce(Promise.resolve(-1)); // DL queue count
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: -1,
      errorRate: 0,
      migrateFlag: 'true',
    });
  });

  it('should fail fast on any error when getting the number of items in the migration segments queue', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(Promise.resolve(mockInvocationStatistics));
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(-1)); // migration segment queue count
    await handler({}, mockContext, () => {});
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(getMetricStatistics).toHaveBeenCalledTimes(2);
    expect(getSqsQueueCount).toHaveBeenCalledTimes(2);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: 0,
      errorRate: 0,
      migrateFlag: 'true',
      totalActiveJobs: -1,
    });
  });

  it('should return a zero error rate if no invocations have happened', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(mockErrorStatistics))
      .mockReturnValueOnce(
        Promise.resolve({
          Datapoints: [
            {
              Sum: 0,
              Unit: 'Count',
            },
          ],
          Label: 'Invocations',
        } as GetMetricStatisticsOutput),
      );
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // migration segment queue count
    getMigrationQueueIsEmptyFlag.mockReturnValueOnce(Promise.resolve(true));
    await handler({}, mockContext, () => {});
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: 0,
      errorRate: 0,
      migrateFlag: 'true',
      migrationQueueIsEmptyFlag: true,
      totalActiveJobs: 0,
    });
  });

  it('should throw an error if the errors metrics statistics object is empty', async () => {
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve({} as GetMetricStatisticsOutput))
      .mockReturnValueOnce(Promise.resolve({} as GetMetricStatisticsOutput));
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // migration segment queue count
    getMigrationQueueIsEmptyFlag.mockReturnValueOnce(Promise.resolve(true));
    await handler({}, mockContext, () => {});
    expect(mockContext.succeed).toHaveBeenCalledWith({
      errorRate: -1,
      migrateFlag: 'true',
    });
  });

  it('should return a zero error rate if the errors metrics statistics are undefined', async () => {
    const sumUndefined = {
      Datapoints: [{}],
    };
    process.env.MIGRATE_FLAG = 'true';
    getMetricStatistics
      .mockReturnValueOnce(Promise.resolve(sumUndefined))
      .mockReturnValueOnce(Promise.resolve(sumUndefined));
    getSqsQueueCount
      .mockReturnValueOnce(Promise.resolve(0)) // DL queue count
      .mockReturnValueOnce(Promise.resolve(0)); // migration segment queue count
    getMigrationQueueIsEmptyFlag.mockReturnValueOnce(Promise.resolve(true));
    await handler({}, mockContext, () => {});
    expect(mockContext.succeed).toHaveBeenCalledWith({
      dlQueueCount: 0,
      errorRate: 0,
      migrateFlag: 'true',
      migrationQueueIsEmptyFlag: true,
      totalActiveJobs: 0,
    });
  });
});
