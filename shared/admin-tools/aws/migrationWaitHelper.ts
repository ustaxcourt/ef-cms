import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  GetMetricStatisticsOutput,
} from '@aws-sdk/client-cloudwatch';
import { DateTime } from 'luxon';
import { countItemsInQueue } from './sqsHelper';
import { getSSMItem, putSSMItem } from './ssmHelper';

const cloudwatchClient = new CloudWatchClient({ region: 'us-east-1' });
const { STAGE } = process.env;
const key = 'migration-queue-empty';

export const getMetricStatistics = async (
  type: string,
): Promise<GetMetricStatisticsOutput> => {
  const now = DateTime.now();
  const start = DateTime.now().minus({ minutes: 15 });
  const command = new GetMetricStatisticsCommand({
    Dimensions: [
      {
        Name: 'FunctionName',
        Value: `migration_segments_lambda_${STAGE}`,
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

export const getSqsQueueCount = (queueUrl: string): Promise<number> => {
  return countItemsInQueue({ QueueUrl: queueUrl });
};

export async function putMigrationQueueIsEmptyFlag(
  value: boolean,
): Promise<boolean> {
  return await putSSMItem(key, value);
}

export async function getMigrationQueueIsEmptyFlag(): Promise<boolean> {
  return (await getSSMItem(key)) === 'true';
}
