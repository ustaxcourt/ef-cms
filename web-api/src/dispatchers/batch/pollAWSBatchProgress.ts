import { DescribeJobsCommand } from '@aws-sdk/client-batch';
import {
  CloudWatchLogsClient,
  GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import {
  AWS_BATCH_POLLING_INTERVAL,
  AWS_BATCH_POLLING_TIMEOUT,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { ProgressData } from '@web-api/persistence/s3/zipDocuments';
import {
  createISODateString,
  dateStringsCompared,
} from '@shared/business/utilities/DateHandler';

interface PingCloudWatchParams {
  applicationContext: ServerApplicationContext;
  jobId: string;
  pollInterval?: number;
  timeout?: number;
  onProgress: (progressData: ProgressData) => Promise<void>;
}

export const pollAWSBatchProgress = async ({
  applicationContext,
  jobId,
  pollInterval = AWS_BATCH_POLLING_INTERVAL,
  timeout = AWS_BATCH_POLLING_TIMEOUT,
  onProgress,
}: PingCloudWatchParams) => {
  const startTime = createISODateString();
  const batchClient = applicationContext.getBatchClient('us-east-1');
  const logsClient = new CloudWatchLogsClient({ region: 'us-east-1' });

  let logStreamName: string | undefined;
  let nextToken: string | undefined;

  while (true) {
    const currentTime = createISODateString();
    const elapsedMs = dateStringsCompared(currentTime, startTime, {
      exact: true,
    });

    if (elapsedMs > timeout) {
      throw new Error(`Batch job ${jobId} timed out after ${timeout}ms`);
    }

    const describeCommand = new DescribeJobsCommand({
      jobs: [jobId],
    });

    const jobDetails = await batchClient.send(describeCommand);

    const job = jobDetails.jobs?.[0];

    if (!job) {
      throw new Error('Job not found');
    }

    const { status } = job;
    applicationContext.logger.info(`Job ${jobId} is currently ${status}`);

    // If status is STARTING, logStreamName is not yet available, so wait and try again
    if (status === 'STARTING') {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      continue;
    }

    if (!logStreamName && job.container?.logStreamName) {
      logStreamName = job.container?.logStreamName ?? logStreamName;
    }

    // Read progress from logs
    if (logStreamName && onProgress) {
      try {
        const logEvents = await logsClient.send(
          new GetLogEventsCommand({
            logGroupName: `/aws/batch/job`,
            logStreamName,
            startFromHead: false,
            nextToken,
          }),
        );

        if (logEvents.events && logEvents.events.length > 0) {
          // Parse progress from log messages
          for (const event of logEvents.events) {
            const progress = parseProgressFromLog(event.message);
            if (progress) {
              await onProgress(progress);
            }
          }
          nextToken = logEvents.nextForwardToken;
        }
      } catch (error) {
        applicationContext.logger.info(
          `Job ${jobId}: Error reading logs: ${error}`,
        );
      }
    }

    if (status === 'SUCCEEDED') {
      return job;
    }

    if (status === 'FAILED') {
      throw new Error(
        `Batch job ${jobId} failed: ${job.statusReason || 'Unknown reason'}`,
      );
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
};

const parseProgressFromLog = (message?: string): ProgressData | undefined => {
  if (!message) return;
  if (message.includes('PROGRESS:')) {
    const jsonStr = message.substring(message.indexOf('{'));
    const json = JSON.parse(jsonStr);
    return {
      filesCompleted: json.currentFile,
      totalFiles: json.totalFiles,
    };
  }
};
