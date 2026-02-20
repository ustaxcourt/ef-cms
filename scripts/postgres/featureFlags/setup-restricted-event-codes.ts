#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'setup-restricted-event-codes - Sets the list of restricted event codes in Feature Flag table',
  parameters: {
    eventCodes: {
      default: '', // Pass in a comma-separated string of event codes when calling the script
      position: 0,
      required: false,
      type: 'string',
    },
  },
};

const { eventCodes } = parseArgsAndEnvVars(scriptConfig) as {
  eventCodes: string;
};

async function setupRestrictedEventCodes() {
  const VALUE = eventCodes;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'restricted-event-codes',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupRestrictedEventCodes();
