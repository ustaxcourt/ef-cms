#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'setup-new-trial-cities - Sets whether the new trial cities are enabled',
  parameters: {
    enabled: {
      default: false,
      type: 'boolean',
    },
  },
};

const parsedArguments = parseArgsAndEnvVars(scriptConfig);
const enabled = parsedArguments.enabled === true;

async function setupNewTrialCities(): Promise<void> {
  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'new-trial-cities',
        value: { current: enabled },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupNewTrialCities();
