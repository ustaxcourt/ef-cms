#!/usr/bin/env -S npx ts-node --transpile-only

import { type AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { type ResultField } from '@aws-sdk/client-cloudwatch-logs';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
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
    ustcAdminUser: 'USTC_ADMIN_USER',
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
const { endDateISO, env, region, startDateISO, ustcAdminUser } =
  parseArgsAndEnvVars(scriptConfig) as {
    endDateISO: string;
    env: string;
    region: string;
    startDateISO: string;
    ustcAdminUser: string;
  };
const start = DateTime.fromISO(startDateISO, { setZone: true });
const end = DateTime.fromISO(endDateISO, { setZone: true });
if (!start.isValid || !end.isValid) {
  throw new Error('startDateISO and endDateISO must be valid ISO-8601 strings');
}
if (end.toMillis() <= start.toMillis()) {
  throw new Error('endDateISO must be after startDateISO');
}

type docketEntryType = {
  docketEntryId: string;
  docketNumber: string;
};

const findDocketEntriesThatFailedOCR = async (): Promise<docketEntryType[]> => {
  const queryString = [
    'fields request.body',
    '| filter @message like /Failed to parse PDF/',
    '| parse request.body \'"docketEntryId":"*"\' as docketEntryId',
    '| parse request.body \'"subjectCaseDocketNumber":"*"\' as docketNumber',
    '| sort @timestamp desc',
    '| limit 10000',
    '| display docketEntryId, docketNumber',
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

  const docketEntries: { [k: string]: docketEntryType } = {};
  for (const row of results) {
    const docketEntry: docketEntryType = {
      docketEntryId: '',
      docketNumber: '',
    };
    for (const f of row as ResultField[]) {
      if (f.field === 'docketEntryId' && f.value) {
        docketEntry.docketEntryId = f.value;
      }
      if (f.field === 'docketNumber' && f.value) {
        docketEntry.docketNumber = f.value;
      }
    }
    if (docketEntry.docketEntryId.length && docketEntry.docketNumber.length) {
      docketEntries[docketEntry.docketEntryId] = docketEntry;
    }
  }

  return Object.values(docketEntries);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const docketEntriesToScrape = await findDocketEntriesThatFailedOCR();
  console.log(`Found ${docketEntriesToScrape.length} docket entries to scrape`);

  const authorizedUser: AuthUser = {
    email: ustcAdminUser,
    name: ustcAdminUser.split('@')[0],
    role: 'docketclerk',
    userId: applicationContext.getUniqueId(),
  };

  for (const payload of docketEntriesToScrape) {
    const message: WorkerMessage = {
      authorizedUser,
      payload,
      type: MESSAGE_TYPES.SCRAPE_DOCUMENT_CONTENTS,
    };
    await worker(applicationContext, { message });
  }
  console.log(`Sent ${docketEntriesToScrape.length} messages to the queue`);
})();
