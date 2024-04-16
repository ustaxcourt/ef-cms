import { approvePendingJob } from '../../../../../shared/admin-tools/circleci/circleci-helper';
import { areAllReindexTasksFinished } from '../../../../../scripts/elasticsearch/check-reindex-complete';
import type { Handler } from 'aws-lambda';

export const handler: Handler = async (_event, context) => {
  const environmentName = process.env.STAGE!;
  const migrateFlag = process.env.MIGRATE_FLAG!;
  console.log(`Migrate flag is ${migrateFlag}`);

  if (migrateFlag === 'true') {
    return succeed({ context, results: { migrateFlag } });
  }

  const isReindexFinished = await areAllReindexTasksFinished({
    environmentName,
  });

  // TODO option 1: check for "isApprovable" -- if not approval, don't attempt approve.
  if (!isReindexFinished) {
    console.log('Reindex is not complete');
    return succeed({ context, results: { isReindexFinished, migrateFlag } });
  }

  console.log('Approving CircleCI wait for reindex job');

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN!;
  const jobName = 'wait-for-reindex';
  const workflowId = process.env.CIRCLE_WORKFLOW_ID!;

  await approvePendingJob({ apiToken, jobName, workflowId });
  return succeed({ context, results: { isReindexFinished, migrateFlag } });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
