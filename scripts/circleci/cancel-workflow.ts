import { cancelWorkflow } from '../../shared/admin-tools/circleci/circleci-helper';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['CIRCLE_MACHINE_USER_TOKEN', 'CIRCLE_WORKFLOW_ID']);

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN!;
const workflowId = process.env.CIRCLE_WORKFLOW_ID!;

(async () => {
  await cancelWorkflow({ apiToken, workflowId });
})();
