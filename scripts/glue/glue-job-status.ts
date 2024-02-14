// usage: npx ts-node --transpile-only scripts/glue/start-glue-job.ts

import { getRunStateOfMostRecentJobRun } from '../../shared/admin-tools/aws/glueHelper';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV']);

if (process.env.ENV !== 'prod') {
  console.error('Glue jobs are performed in the production environment.');
  process.exit();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await getRunStateOfMostRecentJobRun(true);
})();
