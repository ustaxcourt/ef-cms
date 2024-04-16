import { approvePendingJob } from '../../shared/admin-tools/circleci/circleci-helper';
// import { requireEnvVars } from '../../shared/admin-tools/util';

// requireEnvVars([
//   'APPROVAL_JOB_NAME',
//   'CIRCLE_MACHINE_USER_TOKEN',
//   'CIRCLE_WORKFLOW_ID',
// ]);

const apiToken = process.env.CIRCLE_PERSONAL_TOKEN!;
// const jobName = process.env.APPROVAL_JOB_NAME!;
// const workflowId = process.env.CIRCLE_WORKFLOW_ID!;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await approvePendingJob({
    apiToken,
    jobName: 'wait-for-reindex',
    workflowId: '39a76170-4a42-409e-95e5-bfcf163e7f71',
  });
})();
