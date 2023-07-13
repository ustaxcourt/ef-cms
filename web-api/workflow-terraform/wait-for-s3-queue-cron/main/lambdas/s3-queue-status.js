const {
  addToQueue,
  countItemsInQueue,
} = require('../../../../../shared/admin-tools/aws/sqsHelper');
const {
  approvePendingJob,
  cancelWorkflow,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  generateBucketTruncationQueueEntries,
} = require('../../../process-s3-queue/main/utilities/generate-truncation-queue');
const {
  getItem,
  putItem,
} = require('../../../../../shared/admin-tools/aws/deployTableHelper');

const key = 's3-queue-is-empty';
const jobName = 'wait-for-s3-queue-to-process';

exports.handler = async (input, context) => {
  const {
    BUCKET_NAME: Bucket,
    CIRCLE_MACHINE_USER_TOKEN: apiToken,
    CIRCLE_WORKFLOW_ID: workflowId,
    S3_BUCKET_DL_QUEUE_URL: dlQueueUrl,
    S3_BUCKET_QUEUE_URL: QueueUrl,
    STAGE: env,
  } = process.env;
  const emptyingBucket = Number(process.env.EMPTYING_BUCKET);
  const results = { s3DlQueueCount: 0 };

  results.s3DlQueueCount = await countItemsInQueue({ QueueUrl: dlQueueUrl });
  if (results.s3DlQueueCount === -1) {
    return succeed({ context, results });
  }
  if (results.s3DlQueueCount > 0) {
    await cancelWorkflow({ apiToken, workflowId });
    return succeed({ context, results });
  }

  results.s3QueueCount = await countItemsInQueue({ QueueUrl });
  if (results.s3QueueCount === -1) {
    return succeed({ context, results });
  }
  if (results.s3QueueCount > 0) {
    await putItem({ env, key, value: false });
    return succeed({ context, results });
  }

  if (emptyingBucket) {
    // if we are emptying the S3 bucket and have made it this far,
    // we will have generated delete markers for all the objects we just deleted
    // now let's add those delete markers to the queue to be deleted
    const additionalQueueEntries = await generateBucketTruncationQueueEntries({
      Bucket,
    });
    if (additionalQueueEntries.length) {
      await addToQueue({ QueueUrl, messages: additionalQueueEntries });
      await putItem({ env, key, value: false });
      results.s3QueueCount = await countItemsInQueue({ QueueUrl });
      return succeed({ context, results });
    }
  }

  // it's possible the queue has caught up but there are still events being processed
  // don't approve the job if this is the first consecutive time the queue is empty
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
