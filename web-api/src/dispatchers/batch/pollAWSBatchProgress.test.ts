import { applicationContext } from '@shared/business/test/createTestApplicationContext';

const mockLogClientSend = jest.fn();
const mockBatchClientSend = jest.fn();

jest.mock('@aws-sdk/client-cloudwatch-logs', () => ({
  CloudWatchLogsClient: jest.fn(() => ({
    send: mockLogClientSend,
  })),
  GetLogEventsCommand: jest.fn(),
}));

import { pollAWSBatchProgress } from './pollAWSBatchProgress';

describe('pollAWSBatchProgress', () => {
  const onProgressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext.getBatchClient = jest.fn().mockReturnValue({
      send: mockBatchClientSend,
    });
    mockLogClientSend.mockResolvedValue({
      events: [{ message: 'PROGRESS: {"currentFile": 1, "totalFiles": 2}' }],
      nextForwardToken: 'next-token',
    });
    mockBatchClientSend.mockResolvedValue({
      jobs: [
        {
          status: 'SUCCEEDED',
          container: { logStreamName: 'test-log-stream' },
        },
      ],
    });
  });

  it('throws a timeout error when timeout is exceeded', async () => {
    await expect(
      pollAWSBatchProgress({
        applicationContext,
        jobId: 'non-existent-job-id',
        timeout: -1,
        onProgress: onProgressMock,
      }),
    ).rejects.toThrow('Batch job non-existent-job-id timed out after -1ms');
  });

  it('throws an error if the job is not found', async () => {
    mockBatchClientSend.mockResolvedValue({ jobs: [] });

    await expect(
      pollAWSBatchProgress({
        applicationContext,
        jobId: 'non-existent-job-id',
        onProgress: onProgressMock,
      }),
    ).rejects.toThrow('Job not found');
  });

  it('logs error if retrieving log events fails', async () => {
    mockBatchClientSend.mockResolvedValue({
      jobs: [
        {
          status: 'FAILED',
          statusReason: 'from test',
          container: { logStreamName: 'test-log-stream' },
        },
      ],
    });
    const mockLogInfo = jest.fn();
    applicationContext.logger.info = mockLogInfo;
    mockLogClientSend.mockRejectedValue(new Error('from test'));

    await expect(
      pollAWSBatchProgress({
        applicationContext,
        jobId: 'test-job-id',
        timeout: 1000,
        onProgress: onProgressMock,
      }),
    ).rejects.toThrow('Batch job test-job-id failed: from test');
    expect(mockLogInfo).toHaveBeenCalledWith(
      expect.stringContaining('Error reading logs:'),
    );
  });

  it('throws an error with status reason when job fails', async () => {
    mockBatchClientSend.mockResolvedValue({
      jobs: [
        {
          status: 'FAILED',
          statusReason: 'from test',
          container: { logStreamName: 'test-log-stream' },
        },
      ],
    });

    await expect(
      pollAWSBatchProgress({
        applicationContext,
        jobId: 'failed-job-id',
        timeout: 1000,
        onProgress: onProgressMock,
      }),
    ).rejects.toThrow('Batch job failed-job-id failed: from test');
  });

  it('throws an error with unknown reason when job fails without statusReason', async () => {
    mockBatchClientSend.mockResolvedValue({
      jobs: [
        {
          status: 'FAILED',
          container: { logStreamName: 'test-log-stream' },
        },
      ],
    });

    await expect(
      pollAWSBatchProgress({
        applicationContext,
        jobId: 'failed-job-id',
        timeout: 1000,
        onProgress: onProgressMock,
      }),
    ).rejects.toThrow('Batch job failed-job-id failed: Unknown reason');
  });

  it('skips onProgress callback when message is empty', async () => {
    mockLogClientSend.mockResolvedValue({
      events: [{ message: '' }],
      nextForwardToken: 'next-token',
    });

    const job = await pollAWSBatchProgress({
      applicationContext,
      jobId: 'succeeded-job-id',
      pollInterval: 10,
      timeout: 1000,
      onProgress: onProgressMock,
    });

    expect(onProgressMock).not.toHaveBeenCalled();
    expect(job.status).toBe('SUCCEEDED');
  });

  it('calls onProgress callback with parsed progress data', async () => {
    const job = await pollAWSBatchProgress({
      applicationContext,
      jobId: 'succeeded-job-id',
      pollInterval: 10,
      timeout: 1000,
      onProgress: onProgressMock,
    });

    expect(onProgressMock).toHaveBeenCalledWith({
      filesCompleted: 1,
      totalFiles: 2,
    });
    expect(job.status).toBe('SUCCEEDED');
  });

  it('polls job status until SUCCEEDED and returns job', async () => {
    mockBatchClientSend
      .mockResolvedValueOnce({
        jobs: [
          {
            status: 'STARTING',
            container: { logStreamName: 'test-log-stream' },
          },
        ],
      })
      .mockResolvedValueOnce({
        jobs: [
          {
            status: 'PENDING',
            container: { logStreamName: 'test-log-stream' },
          },
        ],
      })
      .mockResolvedValueOnce({
        jobs: [
          {
            status: 'SUCCEEDED',
            container: { logStreamName: 'test-log-stream' },
          },
        ],
      });

    const job = await pollAWSBatchProgress({
      applicationContext,
      jobId: 'succeeded-job-id',
      pollInterval: 10,
      timeout: 1000,
      onProgress: onProgressMock,
    });

    expect(onProgressMock).toHaveBeenCalledTimes(2);
    expect(job.status).toBe('SUCCEEDED');
  });
});
