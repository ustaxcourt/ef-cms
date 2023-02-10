import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} from '@aws-sdk/client-cloudwatch';
import { DateTime } from 'luxon';
import { GetQueueAttributesCommand, SQSClient } from '@aws-sdk/client-sqs';
import { failPendingJob } from './shared/admin-tools/circleci/interact-with-pending-job';

const sqsClient = new SQSClient({ region: 'us-east-1' });
const cloudwatchClient = new CloudWatchClient({ region: 'us-east-1' });

const getSqsQueueCount = async QueueUrl => {
  const command = new GetQueueAttributesCommand({
    AttributeNames: [
      'ApproximateNumberOfMessages',
      'ApproximateNumberOfMessagesNotVisible',
      'ApproximateNumberOfMessagesDelayed',
    ],
    QueueUrl,
  });
  let data;
  try {
    data = await sqsClient.send(command);
  } catch (error) {
    console.log(error);
  }
  return data;
};

const getMetricStatistics = async type => {
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

exports.failOnSegmentsErrorCount = async () => {
  const errorResponse = await getMetricStatistics('Errors');
  const invocationResponse = await getMetricStatistics('Invocations');
  const errorTotal = errorResponse.length;
  const invocationTotal = invocationResponse.length;
  if (errorResponse && invocationResponse) {
    console.log(`There were ${errorTotal} errors in the last 15 minutes.`);
    console.log(
      `There were ${invocationTotal} invocations in the last 15 minutes.`,
    );
    const failurePercentage = (errorTotal * 100) / invocationTotal;
    console.log(
      `There were ${failurePercentage}% errors in the last 15 minutes`,
    );
    if (failurePercentage > 50) {
      const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
      const workflowId = process.env.CIRCLE_WORKFLOW_ID;

      await failPendingJob({ apiToken, workflowId });
    }
  }
};

exports.getTotalInQueue = async () => {
  const queueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${process.env.ENV}`;
  return await getSqsQueueCount(queueUrl);
};

exports.getTotalInDLQueue = async () => {
  const queueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_dl_queue_${process.env.ENV}`;
  return await getSqsQueueCount(queueUrl);
};
