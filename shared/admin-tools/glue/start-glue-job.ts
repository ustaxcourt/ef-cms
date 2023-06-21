// usage: npx ts-node --transpile-only shared/admin-tools/glue/start-glue-job.ts efcms-test-alpha

import { requireEnvVars } from '../util';
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

const sourceTable = process.env.SOURCE_TABLE;

import { startGlueJob } from '../aws/glueHelper';

(async () => {
  // @ts-ignore TS2322 - process will have exited during requireEnvVars call if SOURCE_TABLE is not set
  await startGlueJob({ destinationTable, sourceTable });
})();
