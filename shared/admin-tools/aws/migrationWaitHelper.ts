import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} from '@aws-sdk/client-cloudwatch';
import { DateTime } from 'luxon';
import { GetQueueAttributesCommand, SQSClient } from '@aws-sdk/client-sqs';

const cloudwatchClient = new CloudWatchClient({ region: 'us-east-1' });
const sqsClient = new SQSClient({ region: 'us-east-1' });

export const getSqsQueueCount = async queueUrl => {
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
  }
  console.log('sqs queue data: ', data);
  return data; //data.something.length?
};

export const getMetricStatistics = async type => {
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
    Statistics: ['sum'],
  });
  let data;
  try {
    data = await cloudwatchClient.send(command);
  } catch (error) {
    console.log(error);
  }
  return data;
};
