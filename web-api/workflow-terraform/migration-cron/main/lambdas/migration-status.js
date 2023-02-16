const {
  approvePendingJob,
  cancelWorkflow,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  getMetricStatistics,
  getMigrationQueueIsEmptyFlag,
  getSqsQueueCount,
  putMigrationQueueIsEmptyFlag,
} = require('../../../../../shared/admin-tools/aws/migrationWaitHelper');

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
const workflowId = process.env.CIRCLE_WORKFLOW_ID;
const dlQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_dl_queue_${process.env.STAGE}`;
const workQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${process.env.STAGE}`;

exports.handler = async (input, context) => {
  let shouldProceed = false;
  let shouldCancel = false;
  const migrateFlag = process.env.MIGRATE_FLAG;
  const results = { migrateFlag };
  if (migrateFlag === 'true') {
    const segmentErrorRate = await getSegmentErrorRate();

    if (segmentErrorRate === -1) {
      return context.succeed({ ...results, shouldCancel, shouldProceed });
    }

    results.errorRate = segmentErrorRate;
    const highErrorRate = results.errorRate > 50;
    if (highErrorRate) {
      shouldCancel = true;
    }
    results.dlQueueCount = await getSqsQueueCount(dlQueueUrl);
    const dlQueueHasItems = results.dlQueueCount > 0;
    if (dlQueueHasItems) {
      shouldCancel = true;
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

  if (shouldCancel) {
    await cancelWorkflow({ apiToken, workflowId });
    return context.fail({ ...results, shouldCancel, shouldProceed });
  }
  if (shouldProceed) {
    await approvePendingJob({ apiToken, workflowId });
  }
  return context.succeed({ ...results, shouldCancel, shouldProceed });
};

const getSegmentErrorRate = async () => {
  let errorResponse = {};
  let invocationResponse = {};
  try {
    errorResponse = await getMetricStatistics('Errors');
    invocationResponse = await getMetricStatistics('Invocations');
  } catch (error) {
    console.log(error);
    return -1;
  }

  let errorTotal = 0;
  if ('Datapoints' in errorResponse && errorResponse.Datapoints.length > 0) {
    for (const datapoint of errorResponse.Datapoints) {
      if ('Sum' in datapoint) {
        errorTotal += Number(datapoint.Sum);
      }
    }
  }

  let invocationTotal = 0;
  if (
    'Datapoints' in invocationResponse &&
    invocationResponse.Datapoints.length > 0
  ) {
    for (const datapoint of invocationResponse.Datapoints) {
      if ('Sum' in datapoint) {
        invocationTotal += Number(datapoint.Sum);
      }
    }
  }

  if (invocationTotal > 0) {
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
