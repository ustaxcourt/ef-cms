const {
  approvePendingJob,
} = require('../../../../../shared/admin-tools/circleci/approve-pending-job');

exports.handler = async () => {
  const migrateFlag = process.env.MIGRATE_FLAG;

  if (migrateFlag === 'true') {
    console.log(`Migrate flag is ${migrateFlag}`);
    // const environmentName = process.env.ENVIRONMENT;
    const isMigrationFinished = false; //await isMigrationComplete(environmentName);

    if (!isMigrationFinished) {
      console.log('Migration is not complete');
      return;
    }
  }

  console.log('Approving CircleCI wait for reindex job');

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
  const workflowId = process.env.CIRCLE_WORKFLOW_ID;

  await approvePendingJob({ apiToken, workflowId });
};
