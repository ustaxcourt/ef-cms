#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { readyClusterForMigration } from './ready-cluster-for-migration.helpers';

const scriptConfig: ScriptConfig = {
  parameters: {
    domainName: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { domainName } = parseArgsAndEnvVars(scriptConfig) as {
  domainName: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
readyClusterForMigration(domainName).then(() => {
  console.log('finish readying cluster for migration');
});
