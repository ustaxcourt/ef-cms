#!/usr/bin/env npx ts-node --transpile-only

// usage: scripts/glue/start-glue-job.ts efcms-test-alpha

import {
  type ScriptConfig,
  parseArgumentsAndEnvironmentVariables,
} from '../helpers/parseArgumentsAndEnvironmentVariables';
import { startGlueJob } from '../../shared/admin-tools/aws/glueHelper';

const scriptConfig: ScriptConfig = {
  description:
    'start-glue-job - Starts a glue job into the provided dynamo database.',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  parameters: {
    destinationTable: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
};
const { destinationTable, env, sourceTable } =
  parseArgumentsAndEnvironmentVariables(scriptConfig) as {
    destinationTable: string;
    env: string;
    sourceTable: string;
  };

if (env !== 'prod') {
  console.error('Glue jobs must originate from the production environment.');
  process.exit();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await startGlueJob({ destinationTable, sourceTable });
})();
