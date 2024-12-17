#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
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
  requireActiveAwsSession: true,
};
const { destinationTable, env, sourceTable } = parseArgsAndEnvVars(
  scriptConfig,
) as {
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
