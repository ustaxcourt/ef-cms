import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} from '@aws-sdk/client-cloudwatch';
import { DateTime } from 'luxon';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { GetQueueAttributesCommand, SQSClient } from '@aws-sdk/client-sqs';

const cloudwatchClient = new CloudWatchClient({ region: 'us-east-1' });
const sqsClient = new SQSClient({ region: 'us-east-1' });
const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' });

export const getSqsQueueCount = async (queueUrl: string): Promise<number> => {
  const command = new GetQueueAttributesCommand({
    AttributeNames: [
      'ApproximateNumberOfMessages',
      'ApproximateNumberOfMessagesNotVisible',
      'ApproximateNumberOfMessagesDelayed',
    ],
    QueueUrl: queueUrl,
  });
  let data;
  try {
    data = await sqsClient.send(command);
  } catch (error) {
    console.log(error);
    return 0;
  }
  console.log('sqs queue data: ', data);
  return data; //data.something.length?
};

export const getMetricStatistics = async (type: string): Promise<object> => {
  const now = DateTime.now();
  const start = DateTime.now().minus({ minutes: 15 });
  const command = new GetMetricStatisticsCommand({
    Dimensions: [
      {
        Name: 'FunctionName',
        Value: `migration_segments_lambda_${process.env.ENV}`,
      },
    ],
    EndTime: now.toJSDate(),
    MetricName: type,
    Namespace: 'AWS/Lambda',
    Period: 60,
    StartTime: start.toJSDate(),
    Statistics: ['Sum'],
  });
  let data;
  try {
    data = await cloudwatchClient.send(command);
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const putMigrationQueueIsEmptyFlag = async (
  value: boolean,
): Promise<object> => {
  const command = new PutItemCommand({
    Item: {
      current: { BOOL: value },
      pk: { S: 'migration-queue-is-empty' },
      sk: { S: 'migration-queue-is-empty' },
    },
    TableName: `efcms-deploy-${process.env.ENV}`,
  });
  let data;
  try {
    data = await dynamodbClient.send(command);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
  return data;
};

export const getMigrationQueueIsEmptyFlag = async (): Promise<boolean> => {
  const command = new GetItemCommand({
    Key: {
      pk: { S: 'migration-queue-is-empty' },
      sk: { S: 'migration-queue-is-empty' },
    },
    ProjectionExpression: 'current',
    TableName: `efcms-deploy-${process.env.ENV}`,
  });
  let data;
  try {
    data = await dynamodbClient.send(command);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
  return data; //data.current
};
