#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import {
  OPENSEARCH_SYNC_ACTIONS,
  OpenSearchSyncMessageType,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { indexOpenSearchDocketEntries } from 'web-api/elasticsearch/docketEntries/indexOpenSearchDocketEntries';
import { calculateDate } from '@shared/business/utilities/DateHandler';

const scriptConfig: ScriptConfig = {
  description:
    '_index-docket-entries-child: a subprocess script for indexing a chunk of docket entry data that should only be kicked off by index-docket-entries',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
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

const getDocketEntriesToIndex = async (startDate: Date) => {
  console.log('startDate', startDate);
  return await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .select(['docketEntryId', 'docketNumber', 'createdAt'])
      .orderBy('createdAt')
      .orderBy('docketNumber')
      .orderBy('docketEntryId')
      .where('createdAt', '>', startDate)
      .where('createdAt', '<=', calculateDate({ dateString: endDate }))
      .limit(PAGE_SIZE)
      .execute(),
  );
};

let totalItems = 0;

async function main() {
  console.log('HERE WE ARE!', startDate, endDate);
  let currentStartDate = calculateDate({ dateString: startDate });
  let docketEntriesToIndex = await getDocketEntriesToIndex(currentStartDate);

  while (!isEmpty(docketEntriesToIndex)) {
    const message = {
      payload: docketEntriesToIndex.map(data => ({
        docketEntryId: data.docketEntryId,
        docketNumber: data.docketNumber,
      })),
      type: 'dwDocketEntry' as OpenSearchSyncMessageType,
      timestamp: Date.now().toString(),
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    };
    await indexOpenSearchDocketEntries({ message });
    totalItems += docketEntriesToIndex.length;
    console.log(
      `Total docket entries indexed for date range ${startDate} to ${endDate} so far: ${totalItems}`,
    );
    const lastSeenDate =
      docketEntriesToIndex[docketEntriesToIndex.length - 1].createdAt;
    currentStartDate = lastSeenDate;
    docketEntriesToIndex = await getDocketEntriesToIndex(currentStartDate);
  }
  console.log(
    `Done indexing docket entries for for date range ${startDate} to ${endDate}`,
  );
}

main().catch(console.error);
