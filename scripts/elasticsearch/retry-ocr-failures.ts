#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  CloudWatchLogsClient,
  GetQueryResultsCommand,
  StartQueryCommand,
  type ResultField,
} from '@aws-sdk/client-cloudwatch-logs';
import { DateTime } from 'luxon';
import { sleep } from '@shared/tools/helpers';

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
      position: 1,
      required: true,
      type: 'string',
    },
    startDateISO: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { endDateISO, region, startDateISO } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  endDateISO: string;
  region: string;
  startDateISO: string;
};
// validate the timestamps and bail if necessary
const start = DateTime.fromISO(startDateISO, { setZone: true });
const end = DateTime.fromISO(endDateISO, { setZone: true });
if (!start.isValid || !end.isValid) {
  throw new Error('startDateISO and endDateISO must be valid ISO-8601 strings');
}
if (end.toMillis() <= start.toMillis()) {
  throw new Error('endDateISO must be after startDateISO');
}

const findDocketEntryIdsThatFailedOCR = async (): Promise<string[]> => {
  const cloudwatchClient = new CloudWatchLogsClient({ region });
  const queryString = [
    'fields request.body',
    '| filter @message like /Failed to parse PDF/',
    '| parse request.body \'"docketEntryId":"*"\' as docketEntryId',
    '| sort @timestamp desc',
    '| limit 10000',
    '| display docketEntryId',
  ].join('\n');
  const startQuery = await cloudwatchClient.send(
    new StartQueryCommand({
      startTime: start.toSeconds(),
      endTime: end.toSeconds(),
      logGroupNames: [
        '/aws/lambda/api_async_prod_blue',
        '/aws/lambda/api_async_prod_green',
      ],
      queryString,
    }),
  );

  if (!startQuery.queryId) {
    throw new Error('Failed to start CloudWatch Logs Insights query');
  }

  const { queryId } = startQuery;
  let status: string | undefined;
  let results: { field: string; value: string }[][] = [];
  const pollIntervalMs: number = 1500;
  const maxWaitMs: number = 60000; // 1 minute
  const deadlineMs: number = DateTime.now().toMillis() + maxWaitMs;

  while (DateTime.now().toMillis() < deadlineMs) {
    const resp = await cloudwatchClient.send(
      new GetQueryResultsCommand({ queryId }),
    );
    // eslint-disable-next-line prefer-destructuring
    status = resp.status;
    if (status === 'Complete') {
      // @ts-ignore
      results = resp.results ?? [];
      break;
    }
    if (status === 'Failed' || status === 'Cancelled' || status === 'Timeout') {
      throw new Error(
        `Logs Insights query did not complete successfully: ${status}`,
      );
    }
    await sleep(pollIntervalMs);
  }

  if (status !== 'Complete') {
    throw new Error('Timed out waiting for Logs Insights query to complete');
  }

  const docketEntryIds = new Set<string>();
  for (const row of results) {
    for (const f of row as ResultField[]) {
      if (f.field === 'docketEntryId' && f.value) {
        docketEntryIds.add(f.value);
      }
    }
  }

  return [...docketEntryIds];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // find the failures in Cloudwatch
  const docketEntryIds = await findDocketEntryIdsThatFailedOCR();

  // TODO: drop the docketEntryIds into the OCR queue

  console.log(`Found ${docketEntryIds.length} docketEntryIds`);
  for (const docketEntryId of docketEntryIds) {
    console.log(docketEntryId);
  }
})();
