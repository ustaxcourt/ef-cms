#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { fixRaceConditionServedInDrafts } from './fix-race-condition-served-in-drafts.helpers';
import { readFileSync } from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'fix-race-condition-served-in-drafts - Resolves issue where a document that had been ' +
    'served returned to the drafts folder.',
  environment: { dynamoDbTableName: 'DYNAMODB_TABLE_NAME' },
  parameters: {
    docketEntryId: {
      position: 1,
      required: true,
      type: 'string',
    },
    docketNumber: {
      position: 0,
      required: true,
      type: 'string',
    },
    pathToJsonRequest: {
      position: 3,
      required: true,
      type: 'string',
    },
    performUpdate: {
      default: false,
      type: 'boolean',
    },
    timestamp: {
      position: 2,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const {
    docketEntryId,
    docketNumber,
    pathToJsonRequest,
    performUpdate,
    timestamp,
  } = parseArgsAndEnvVars(scriptConfig) as {
    docketEntryId: string;
    docketNumber: string;
    pathToJsonRequest: string;
    performUpdate: boolean;
    timestamp: string;
  };

  const request = JSON.parse(readFileSync(pathToJsonRequest, 'utf-8'));

  const applicationContext = createApplicationContext({});

  await fixRaceConditionServedInDrafts(applicationContext, {
    docketEntryId,
    docketNumber,
    performUpdate,
    request,
    timestamp,
  });
})();
