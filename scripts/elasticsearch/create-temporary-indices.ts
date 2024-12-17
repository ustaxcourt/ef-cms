#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createNewIndicesFromLocalMappings } from './create-temporary-indices-helpers';

const scriptConfig: ScriptConfig = {
  description:
    'create-temporary-indices - Creates new indices from locally-defined mappings',
  environment: {
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { environmentName } = parseArgsAndEnvVars(scriptConfig) as {
  environmentName: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await createNewIndicesFromLocalMappings({ environmentName });
})();
