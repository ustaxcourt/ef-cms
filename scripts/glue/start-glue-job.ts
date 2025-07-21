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
    prodEnvAccountId: 'PROD_ENV_ACCOUNT_ID',
    sourceTable: 'SOURCE_TABLE',
  },
  parameters: {
    destinationTable: {
      long: 'destination-table',
      required: true,
      type: 'string',
    },
    lowerEnvAccountId: {
      long: 'lower-env-account-id',
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const {
  destinationTable,
  env,
  lowerEnvAccountId,
  prodEnvAccountId,
  sourceTable,
} = parseArgsAndEnvVars(scriptConfig) as {
  destinationTable: string;
  env: string;
  lowerEnvAccountId: string;
  prodEnvAccountId: string;
  sourceTable: string;
};

if (env !== 'prod') {
  console.error('Glue jobs must originate from the production environment.');
  process.exit();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await startGlueJob({
    destinationTable,
    lowerEnvAccountId,
    prodEnvAccountId,
    sourceTable,
  });
})();
