#!/usr/bin/env -S npx ts-node --transpile-only

import { isValidDateString } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'setup-motion-visibility-policy-change-date - Sets the motion visibility policy change date',
  parameters: {
    policyChangeDate: {
      default: '', // Pass in a comma-separated string of event codes when calling the script
      position: 0,
      required: true,
      type: 'string',
    },
  },
};

const { policyChangeDate } = parseArgsAndEnvVars(scriptConfig) as {
  policyChangeDate: string;
};

if (!isValidDateString(policyChangeDate, ['yyyy-MM-dd'])) {
  throw new Error('Invalid date format, please use yyyy-MM-dd');
}

async function setupMotionVisibilityPolicyChangeDate() {
  const VALUE = policyChangeDate;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'motion-visibility-policy-change-date',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupMotionVisibilityPolicyChangeDate();
