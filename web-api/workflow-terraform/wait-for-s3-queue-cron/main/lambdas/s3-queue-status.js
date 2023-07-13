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
const syncQueueUrl = process.env.S3_BUCKET_SYNC_QUEUE_URL;
const syncDlQueueUrl = process.env.S3_BUCKET_SYNC_DL_QUEUE_URL;
const env = process.env.STAGE;
const key = 's3-bucket-sync-queue-is-not-empty';
const jobName = 'wait-for-s3-bucket-sync';

exports.handler = async (input, context) => {
  const results = { s3BucketSyncDlQueueCount: 0 };

  results.s3BucketSyncDlQueueCount = await countItemsInQueue({
    QueueUrl: syncDlQueueUrl,
  });
  if (results.s3BucketSyncDlQueueCount === -1) {
    return succeed({ context, results });
  }
  if (results.s3BucketSyncDlQueueCount > 0) {
    await cancelWorkflow({ apiToken, workflowId });
    return succeed({ context, results });
  }

  // it's possible the queue has caught up but there are still events being processed
  // don't approve the job if this is the first consecutive time the queue is empty
  results.s3BucketSyncQueueCount = await countItemsInQueue({
    QueueUrl: syncQueueUrl,
  });
  if (results.s3BucketSyncQueueCount === -1) {
    return succeed({ context, results });
  }
  if (results.s3BucketSyncQueueCount > 0) {
    await putItem({ env, key, value: false });
    return succeed({ context, results });
  }

  results.s3BucketSyncQueueIsEmptyFlag = await getItem({ env, key });
  if (!results.s3BucketSyncQueueIsEmptyFlag) {
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
