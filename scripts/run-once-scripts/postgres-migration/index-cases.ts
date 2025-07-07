#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { environment } from '@web-api/environment';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { indexOpenSearchCases } from 'web-api/elasticsearch/cases/indexOpenSearchCases';
import {
  OPENSEARCH_SYNC_ACTIONS,
  OpenSearchSyncMessageType,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';

const scriptConfig: ScriptConfig = {
  description: 'add-cases-to-opensearch - Reupsert cases',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const pageSize = 2000; // Arbitrary, but seemed reasonably performant

const getCasesToIndex = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(['docketNumber'])
      .orderBy('docketNumber')
      .limit(pageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItems = 0;

async function main() {
  let offset = 0;
  let casesToIndex = await getCasesToIndex(offset);

  while (!isEmpty(casesToIndex)) {
    const message = {
      payload: casesToIndex.map(d => d.docketNumber),
      type: 'dwCase' as OpenSearchSyncMessageType,
      timestamp: Date.now().toString(),
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    };
    await indexOpenSearchCases({ message });
    totalItems += casesToIndex.length;
    console.log(`Total cases index so far: ${totalItems}`);
    offset += pageSize;
    casesToIndex = await getCasesToIndex(offset);
  }
  console.log('Done indexing cases');
}

main().catch(console.error);
