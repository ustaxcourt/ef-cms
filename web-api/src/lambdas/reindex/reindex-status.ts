import { approvePendingJob } from '../../../../shared/admin-tools/circleci/circleci-helper';
import { areAllReindexTasksFinished } from '../../../../scripts/elasticsearch/check-reindex-complete';
import type { Handler } from 'aws-lambda';

export const handler: Handler = async (_event, _context) => {
  const environmentName = process.env.STAGE!;
  const migrateFlag = process.env.MIGRATE_FLAG!;
  let results = `Migrate flag is ${migrateFlag}`;
  console.log(results);

  if (migrateFlag === 'true') {
    return results;
  }

  const isReindexFinished = await areAllReindexTasksFinished({
    environmentName,
  });

  if (!isReindexFinished) {
    results = 'Reindex is not complete';
    return succeed(results);
  }

  console.log('Approving CircleCI wait for reindex job');

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN!;
  const jobName = 'wait-for-reindex';
  const workflowId = process.env.CIRCLE_WORKFLOW_ID!;

  await approvePendingJob({ apiToken, jobName, workflowId });
  results = 'Reindex is complete';
  return succeed(results);
};

const succeed = (results: string) => {
  console.log(results);
  return results;
};
