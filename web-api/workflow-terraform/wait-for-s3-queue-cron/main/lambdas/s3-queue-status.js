const {
  approvePendingJob,
  cancelWorkflow,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  countItemsInQueue,
} = require('../../../../../shared/admin-tools/aws/sqsHelper');
const {
  getItem,
  putItem,
} = require('../../../../../shared/admin-tools/aws/deployTableHelper');

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
const workflowId = process.env.CIRCLE_WORKFLOW_ID;
const queueUrl = process.env.S3_BUCKET_QUEUE_URL;
const dlQueueUrl = process.env.S3_BUCKET_DL_QUEUE_URL;
const env = process.env.STAGE;
const key = 's3-queue-is-empty';
const jobName = 'wait-for-s3-queue-to-process';

exports.handler = async (input, context) => {
  const results = { s3DlQueueCount: 0 };

  results.s3DlQueueCount = await countItemsInQueue({
    QueueUrl: dlQueueUrl,
  });
  if (results.s3DlQueueCount === -1) {
    return succeed({ context, results });
  }
  if (results.s3DlQueueCount > 0) {
    await cancelWorkflow({ apiToken, workflowId });
    return succeed({ context, results });
  }

  // it's possible the queue has caught up but there are still events being processed
  // don't approve the job if this is the first consecutive time the queue is empty
  results.s3QueueCount = await countItemsInQueue({
    QueueUrl: queueUrl,
  });
  if (results.s3QueueCount === -1) {
    return succeed({ context, results });
  }
  if (results.s3QueueCount > 0) {
    await putItem({ env, key, value: false });
    return succeed({ context, results });
  }

  results.s3QueueIsEmptyFlag = await getItem({ env, key });
  if (!results.s3QueueIsEmptyFlag) {
    await putItem({ env, key, value: true });
  } else {
    await approvePendingJob({ apiToken, jobName, workflowId });
  }
  return succeed({ context, results });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
