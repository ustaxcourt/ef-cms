import { approvePendingJob } from '../../../../../shared/admin-tools/circleci/interact-with-pending-job.js';
import { getMetricStatistics, getSqsQueueCount } from '../../../../is-migration-complete';

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
const workflowId = process.env.CIRCLE_WORKFLOW_ID;

const dlQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_dl_queue_${process.env.ENV}`;
const workQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${process.env.ENV}`;

exports.handler = async() => {

    // while true?
    skipToCleanUpIfHighPercentageOfSegmentErrors();
    skipToCleanUpIfDlQueueHasItems();
    const totalActiveJobs = await getSqsQueueCount(workQueueUrl);

    if (totalActiveJobs === 0) {
        // sleep 120?
        // TODO: beautify this
        skipToCleanUpIfHighPercentageOfSegmentErrors();
        skipToCleanUpIfDlQueueHasItems();
        const recheckTotalActiveJobs = await getSqsQueueCount(workQueueUrl);
        if (recheckTotalActiveJobs === 0) {
            // ready to move on? what to do here?
            return;
        }
    }
}

const skipToCleanUpIfHighPercentageOfSegmentErrors = async() => {
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
        `There were ${failurePercentage}% errors in the last 15 minutes.`,
      );
      if (failurePercentage > 50) {
        await approvePendingJob({ apiToken, workflowId });
      }
    }
  };

const skipToCleanUpIfDlQueueHasItems = async () => {
    if(await getSqsQueueCount(dlQueueUrl) > 0) {
        await approvePendingJob({ apiToken, workflowId });
    }
}
