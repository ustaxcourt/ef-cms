#!/usr/bin/env -S npx ts-node --transpile-only

import { type AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { type ResultField } from '@aws-sdk/client-cloudwatch-logs';
import { applicationContext } from '@web-api/applicationContext';
import { performQuery } from '../cloudwatch/perform-query';
import { worker } from '@web-api/gateways/worker/worker';
import { DateTime } from 'luxon';
import {
  MESSAGE_TYPES,
  type WorkerMessage,
} from '@web-api/gateways/worker/workerRouter';

const scriptConfig: ScriptConfig = {
  description:
    'retry-ocr-failures - Retries OCR failures that occurred during ' +
    'the provided timeframe',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    endDateISO: {
      description: 'ISO-8601 timestamp of the end of the timeframe',
      position: 1,
      required: true,
      type: 'string',
    },
    startDateISO: {
      description: 'ISO-8601 timestamp of the start of the timeframe',
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { endDateISO, env, region, startDateISO } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  endDateISO: string;
  env: string;
  region: string;
  startDateISO: string;
};
const start = DateTime.fromISO(startDateISO, { setZone: true });
const end = DateTime.fromISO(endDateISO, { setZone: true });
if (!start.isValid || !end.isValid) {
  throw new Error('startDateISO and endDateISO must be valid ISO-8601 strings');
}
if (end.toMillis() <= start.toMillis()) {
  throw new Error('endDateISO must be after startDateISO');
}

const findDocketEntryIdsThatFailedOCR = async (): Promise<string[]> => {
  const queryString = [
    'fields request.body',
    '| filter @message like /Failed to parse PDF/',
    '| parse request.body \'"docketEntryId":"*"\' as docketEntryId',
    '| sort @timestamp desc',
    '| limit 10000',
    '| display docketEntryId',
  ].join('\n');

  const results = await performQuery({
    endTime: end.toSeconds(),
    logGroupNames: [
      `/aws/lambda/api_async_${env}_blue`,
      `/aws/lambda/api_async_${env}_green`,
    ],
    region,
    queryString,
    startTime: start.toSeconds(),
  });

  const docketEntryIds = new Set<string>();
  for (const row of results) {
    for (const f of row as ResultField[]) {
      if (f.field === 'docketEntryId' && f.value) {
        docketEntryIds.add(f.value);
      }
    }
  }

  return [...docketEntryIds];
  // TODO: return array of objects containing docketNumber, docketNumberWithSuffix, docketEntryId, and caseCaption
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const docketEntriesToScrape = await findDocketEntryIdsThatFailedOCR(); // TODO: this should be an array of objects

  // TODO: can we just use an empty object here?
  const authorizedUser: AuthUser = {
    email: 'person@hello.com',
    name: 'ignored',
    role: 'adc',
    userId: 'ignored',
  };

  for (const payload of docketEntriesToScrape) {
    const message: WorkerMessage = {
      authorizedUser,
      payload,
      type: MESSAGE_TYPES.SCRAPE_DOCUMENT_CONTENTS,
    };
    await worker(applicationContext, { message });
  }

  console.log(`Found ${docketEntriesToScrape.length} docket entries to scrape`);
  for (const docketEntry of docketEntriesToScrape) {
    console.log(docketEntry);
  }
})();
