import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  DescribeJobsCommand,
  SubmitJobCommand,
  SubmitJobCommandInput,
} from '@aws-sdk/client-batch';
import {
  CloudWatchLogsClient,
  GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { ProgressData } from '@web-api/persistence/s3/zipDocuments';

export const sendZipperBatchJob = async (
  applicationContext: ServerApplicationContext,
  documentsReference: string,
  zipName: string,
  clientConnectionId: string,
  userId: string,
) => {
  const [currentConnection] = (
    await applicationContext
      .getPersistenceGateway()
      .getWebSocketConnectionsByUserId(userId)
  ).filter(connection => {
    return connection.clientConnectionId === clientConnectionId;
  });
  const { connectionId } = currentConnection;

  const { currentColor, efcmsDomain, region, stage } =
    applicationContext.environment;
  const awsRegion = region as 'us-east-1';
  const params: SubmitJobCommandInput = {
    containerOverrides: {
      environment: [
        {
          name: 'WEBSOCKET_CONNECTION_ID',
          value: connectionId,
        },
        {
          name: 'EFCMS_DOMAIN',
          value: efcmsDomain,
        },
        {
          name: 'STAGE',
          value: stage,
        },
        {
          name: 'DOCKET_ENTRY_FILES_REFRENCE',
          value: documentsReference,
        },
        {
          name: 'ZIP_FILE_NAME',
          value: zipName,
        },
      ],
    },
    jobDefinition: `s3-zip-job-${stage}-${currentColor}-${awsRegion}`,
    jobName: `batch-docket-entries-download-${Date.now()}`,
    jobQueue: `aws-batch-job-queue-${stage}-${currentColor}-${awsRegion}`,
  };

  const command = new SubmitJobCommand(params);
  return await applicationContext.getBatchClient(awsRegion).send(command);
};

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
  pollInterval = 5000,
  timeout = 600000,
  onProgress,
}: PingCloudWatchParams) => {
  const startTime = Date.now();
  const batchClient = applicationContext.getBatchClient('us-east-1');
  const logsClient = new CloudWatchLogsClient({ region: 'us-east-1' });

  let logStreamName: string | undefined;
  let nextToken: string | undefined;

  while (true) {
    if (Date.now() - startTime > timeout) {
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
            const progress = parseProgressFromLog(event.message); //
            if (progress) {
              await onProgress(progress);
            }
          }
          nextToken = logEvents.nextForwardToken;
        }
      } catch (error) {
        console.error('Error reading logs:', error);
        // Continue without progress updates
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

export const parseProgressFromLog = (message?: string): ProgressData | null => {
  if (!message) return null;

  // Look for JSON progress messages
  try {
    console.log('Raw log message:', message);
    if (message.includes('PROGRESS:')) {
      const jsonStr = message.substring(message.indexOf('{'));
      console.log('Parsed progress log:', jsonStr);
      const json = JSON.parse(jsonStr);
      return {
        filesCompleted: json.currentFile,
        totalFiles: json.totalFiles,
      };
    }
  } catch (e) {
    // Not a progress message
  }

  return null;
};
