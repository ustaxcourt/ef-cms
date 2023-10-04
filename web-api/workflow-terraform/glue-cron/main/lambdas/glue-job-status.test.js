const {
  approvePendingJob,
  cancelWorkflow,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  getRunStateOfMostRecentJobRun,
} = require('../../../../../shared/admin-tools/aws/glueHelper');
const { handler } = require('./glue-job-status');

jest.mock('../../../../../shared/admin-tools/circleci/circleci-helper', () => ({
  approvePendingJob: jest.fn(),
  cancelWorkflow: jest.fn(),
}));
jest.mock('../../../../../shared/admin-tools/aws/glueHelper', () => ({
  getRunStateOfMostRecentJobRun: jest.fn(),
}));

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
};

describe('glue-job-status', () => {
  console.log = () => null;
  console.error = () => null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns immediately if it can't determine the run state of the most recent glue job", async () => {
    getRunStateOfMostRecentJobRun.mockReturnValueOnce(
      Promise.resolve(undefined),
    );
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      mostRecentRunState: undefined,
    });
  });

  it('neither approves nor cancels the workflow while the glue job is running', async () => {
    getRunStateOfMostRecentJobRun.mockReturnValueOnce(
      Promise.resolve('RUNNING'),
    );
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      mostRecentRunState: 'RUNNING',
    });
  });

  it('cancels the workflow if the most recent glue job failed', async () => {
    getRunStateOfMostRecentJobRun.mockReturnValueOnce(
      Promise.resolve('FAILED'),
    );
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(0);
    expect(cancelWorkflow).toHaveBeenCalledTimes(1);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      mostRecentRunState: 'FAILED',
    });
  });

  it('approves the workflow if the most recent glue job succeeded', async () => {
    getRunStateOfMostRecentJobRun.mockReturnValueOnce(
      Promise.resolve('SUCCEEDED'),
    );
    await handler({}, mockContext);
    expect(approvePendingJob).toHaveBeenCalledTimes(1);
    expect(cancelWorkflow).toHaveBeenCalledTimes(0);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      mostRecentRunState: 'SUCCEEDED',
    });
  });
});
