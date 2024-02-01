// usage: npx ts-node --transpile-only scripts/glue/start-glue-job.ts efcms-test-alpha

import { requireEnvVars } from '../../shared/admin-tools/util';
requireEnvVars(['ENV', 'SOURCE_TABLE']);

if (process.env.ENV !== 'prod') {
  console.error('Glue jobs must originate from the production environment.');
  process.exit();
}

const destinationTable = process.argv[2] || null;
if (!destinationTable) {
  console.error('The destination table must be passed as the first argument.');
  process.exit();
}

const sourceTable = process.env.SOURCE_TABLE!;

import { startGlueJob } from '../../shared/admin-tools/aws/glueHelper';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await startGlueJob({ destinationTable, sourceTable });
})();
