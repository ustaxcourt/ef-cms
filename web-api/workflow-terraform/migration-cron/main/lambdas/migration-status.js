const {
  approvePendingJob,
} = require('../../../../../shared/admin-tools/circleci/interact-with-pending-job');
const {
  getMetricStatistics,
  getMigrationQueueIsEmptyFlag,
  getSqsQueueCount,
  putMigrationQueueIsEmptyFlag,
} = require('../../../../../shared/admin-tools/aws/migrationWaitHelper');

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
const workflowId = process.env.CIRCLE_WORKFLOW_ID;
const dlQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_dl_queue_${process.env.ENVIRONMENT}`;
const workQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${process.env.ENVIRONMENT}`;

exports.handler = async (input, context) => {
  let shouldProceed = false;
  await getSqsQueueCount(workQueueUrl); //TODO: remove after debugging
  const migrateFlag = process.env.MIGRATE_FLAG;
  const results = { migrateFlag };
  if (migrateFlag === 'true') {
    results.errorRate = await getSegmentErrorRate();
    const highErrorRate = results.errorRate > 50;
    if (highErrorRate) {
      shouldProceed = true;
    }
    results.dlQueueCount = await getSqsQueueCount(dlQueueUrl);
    const dlQueueHasItems = results.dlQueueCount > 0;
    if (dlQueueHasItems) {
      shouldProceed = true;
    }

    // it's possible the queue has caught up but there are still more segments to process
    // don't approve the job if this is the first consecutive time the queue is empty
    results.totalActiveJobs = await getSqsQueueCount(workQueueUrl);
    if (!highErrorRate && !dlQueueHasItems) {
      if (results.totalActiveJobs > 0) {
        await putMigrationQueueIsEmptyFlag(false);
      } else {
        results.migrationQueueIsEmptyFlag =
          await getMigrationQueueIsEmptyFlag();
        if (!results.migrationQueueIsEmptyFlag) {
          await putMigrationQueueIsEmptyFlag(true);
        } else {
          shouldProceed = true;
        }
      }
    }
  } else {
    shouldProceed = true;
  }

  if (shouldProceed) {
    await approvePendingJob({ apiToken, workflowId });
  }
  return context.succeed({ ...results, shouldProceed });
};

const getSegmentErrorRate = async () => {
  const errorResponse = await getMetricStatistics('Errors');
  console.log(errorResponse);
  const invocationResponse = await getMetricStatistics('Invocations');
  console.log(invocationResponse);

  const errorTotal = errorResponse.length;
  const invocationTotal = invocationResponse.length;
  if (errorResponse && invocationResponse) {
    console.log(`There were ${errorTotal} errors in the last 15 minutes.`);
    console.log(
      `There were ${invocationTotal} invocations in the last 15 minutes.`,
    );
    const errorRate = (errorTotal * 100) / invocationTotal;
    console.log(`There were ${errorRate}% errors in the last 15 minutes.`);
    return errorRate;
  }
  return 0;
};
