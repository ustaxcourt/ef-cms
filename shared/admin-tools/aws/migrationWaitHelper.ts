import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} from '@aws-sdk/client-cloudwatch';
import { DateTime } from 'luxon';
import { countItemsInQueue } from './sqsHelper';
import { getItem, putItem } from './deployTableHelper';

const cloudwatchClient = new CloudWatchClient({ region: 'us-east-1' });
const env = process.env.STAGE;
const key = 'migration-queue-is-empty';

export const getMetricStatistics = async (type: string): Promise<object> => {
  const now = DateTime.now();
  const start = DateTime.now().minus({ minutes: 15 });
  const command = new GetMetricStatisticsCommand({
    Dimensions: [
      {
        Name: 'FunctionName',
        Value: `migration_segments_lambda_${process.env.STAGE}`,
      },
    ],
    EndTime: now.toJSDate(),
    MetricName: type,
    Namespace: 'AWS/Lambda',
    Period: 60,
    StartTime: start.toJSDate(),
    Statistics: ['Sum'],
  });
  return await cloudwatchClient.send(command);
};

export const getSqsQueueCount = queueUrl => {
  return countItemsInQueue({ QueueUrl: queueUrl });
};

export const putMigrationQueueIsEmptyFlag = (
  value: boolean,
): Promise<boolean> => {
  if (env) {
    return putItem({ env, key, value });
  }
  return Promise.resolve(false);
};

export const getMigrationQueueIsEmptyFlag = async (): Promise<boolean> => {
  if (env) {
    return (await getItem({ env, key })) as boolean;
  }
  return false;
};
