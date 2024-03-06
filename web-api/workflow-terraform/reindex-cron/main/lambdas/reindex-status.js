const {
  approvePendingJob,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  areAllReindexTasksFinished,
} = require('../../../../../scripts/elasticsearch/check-reindex-complete');

exports.handler = async (input, context) => {
  const environmentName = process.env.STAGE;
  const migrateFlag = process.env.MIGRATE_FLAG;
  console.log(`Migrate flag is ${migrateFlag}`);

  if (migrateFlag === 'true') {
    return succeed({ context, results: { migrateFlag } });
  }

  const isReindexFinished = await areAllReindexTasksFinished({
    environmentName,
  });
  if (!isReindexFinished) {
    console.log('Reindex is not complete');
    return succeed({ context, results: { isReindexFinished, migrateFlag } });
  }

  console.log('Approving CircleCI wait for reindex job');

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
  const jobName = 'wait-for-reindex';
  const workflowId = process.env.CIRCLE_WORKFLOW_ID;

  await approvePendingJob({ apiToken, jobName, workflowId });
  return succeed({ context, results: { isReindexFinished, migrateFlag } });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
