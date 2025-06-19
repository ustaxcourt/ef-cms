#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { indexOpenSearchCase } from 'web-api/elasticsearch/index-cases';
import { OpenSearchSyncMessageType } from '@web-api/lambdas/openSearch/openSearchSyncHandler';

const scriptConfig: ScriptConfig = {
  description: 'add-cases-to-opensearch - Reupsert cases',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

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
    };
    await indexOpenSearchCase({ message });
    totalItems += casesToIndex.length;
    console.log(`Total cases index so far: ${totalItems}`);
    offset += pageSize;
    casesToIndex = await getCasesToIndex(offset);
  }
  console.log('Done indexing cases');
}

main().catch(console.error);
