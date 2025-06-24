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
import { indexOpenSearchDocketEntries } from 'web-api/elasticsearch/docketEntries/indexOpenSearchDocketEntries';

const scriptConfig: ScriptConfig = {
  description: 'add-cases-to-opensearch - Reupsert cases',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const pageSize = 2000;

const getDocketEntriesToIndex = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .select(['docketEntryId', 'docketNumber'])
      .orderBy('docketNumber')
      .orderBy('docketEntryId')
      .limit(pageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItems = 0;

async function main() {
  let offset = 0;
  let docketEntriesToIndex = await getDocketEntriesToIndex(offset);

  while (!isEmpty(docketEntriesToIndex)) {
    const message = {
      payload: docketEntriesToIndex,
      type: 'dwDocketEntry' as OpenSearchSyncMessageType,
      timestamp: Date.now().toString(),
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    };
    await indexOpenSearchDocketEntries({ message });
    totalItems += docketEntriesToIndex.length;
    console.log(`Total docket entries indexed so far: ${totalItems}`);
    offset += pageSize;
    docketEntriesToIndex = await getDocketEntriesToIndex(offset);
  }
  console.log('Done indexing docket entries');
}

main().catch(console.error);
