#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import {
  OPENSEARCH_SYNC_ACTIONS,
  OpenSearchSyncMessageType,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import {
  calculateDate,
  getCurrentDateTimeInMillis,
} from '@shared/business/utilities/DateHandler';
import { indexOpenSearchCases } from 'web-api/elasticsearch/cases/indexOpenSearchCases';

const scriptConfig: ScriptConfig = {
  description:
    '_index-cases-child: a subprocess script for indexing a chunk of case data that should only be kicked off by index-cases',
  environment: {
    env: 'ENV',
  },
  parameters: {
    startDate: {
      position: 0,
      required: true,
      type: 'string',
    },
    endDate: {
      position: 1,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { startDate, endDate } = parseArgsAndEnvVars(scriptConfig) as {
  startDate: string;
  endDate: string;
};
const PAGE_SIZE = 2000;

let totalItems = 0;

/*
This script is only meant to be kicked off by index-cases.ts. It paginates over a partition
of cases in a date range to index them.
*/
async function main() {
  let currentStartDate = calculateDate({ dateString: startDate });
  let casesToIndex = await getCasesToIndex(currentStartDate);

  while (!isEmpty(casesToIndex)) {
    const message = {
      payload: casesToIndex.map(c => c.docketNumber),
      type: 'dwCase' as OpenSearchSyncMessageType,
      timestamp: `${getCurrentDateTimeInMillis()}`,
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    };
    await indexOpenSearchCases({ message });
    totalItems += casesToIndex.length;
    console.log(
      `Total cases indexed for date range ${startDate} to ${endDate} so far: ${totalItems}`,
    );
    const lastSeenDate = casesToIndex[casesToIndex.length - 1].createdAt;
    currentStartDate = lastSeenDate;
    casesToIndex = await getCasesToIndex(currentStartDate);
  }
  console.log(
    `Done indexing cases for for date range ${startDate} to ${endDate}`,
  );
}

const getCasesToIndex = async (startDate: Date) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(['docketNumber', 'createdAt'])
      .orderBy('createdAt')
      .orderBy('docketNumber')
      .where('createdAt', '>', startDate)
      .where('createdAt', '<=', calculateDate({ dateString: endDate }))
      .limit(PAGE_SIZE)
      .execute(),
  );
};

main().catch(console.error);
