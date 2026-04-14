#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { isEmpty } from 'lodash';
import {
  OPENSEARCH_SYNC_ACTIONS,
  OpenSearchSyncMessageType,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { indexOpenSearchUser } from 'web-api/elasticsearch/index-users';

const scriptConfig: ScriptConfig = {
  description:
    '_index-users-child: a subprocess script for indexing a chunk of user data that should only be kicked off by index-users',
  environment: {
    env: 'ENV',
  },
  parameters: {
    startUserId: {
      position: 0,
      required: true,
      type: 'string',
    },
    endUserId: {
      position: 1,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { startUserId: rawStartUserId, endUserId: rawEndUserId } = parseArgsAndEnvVars(scriptConfig) as {
  startUserId: string;
  endUserId: string;
};
const isMin = (v: string) => v === '__MIN__';
const isMax = (v: string) => v === '__MAX__';
const startUserId = rawStartUserId;
const endUserId = rawEndUserId;
const PAGE_SIZE = 2000;

let totalItems = 0;

/*
This script is only meant to be kicked off by index-users.ts. It paginates over a partition
of users in a userId range to index them.
*/
async function main() {
  let currentStartUserId: string | null = isMin(startUserId) ? null : startUserId;
  let usersToIndex = await getUsersToIndex(currentStartUserId);

  while (!isEmpty(usersToIndex)) {
    const message = {
      payload: usersToIndex.map(data => data.userId),
      type: 'dwUser' as OpenSearchSyncMessageType,
      timestamp: Date.now().toString(),
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    };

    await indexOpenSearchUser({ message });
    totalItems += usersToIndex.length;
    console.log(
      `Total users indexed for userId range ${startUserId} to ${endUserId} so far: ${totalItems}`,
    );

    const lastSeenUserId = usersToIndex[usersToIndex.length - 1].userId;
    currentStartUserId = lastSeenUserId;
    usersToIndex = await getUsersToIndex(currentStartUserId);
  }

  console.log(
    `Done indexing users for userId range ${startUserId} to ${endUserId}`,
  );
}

const getUsersToIndex = async (start: string | null) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .select(['userId'])
      .orderBy('userId')
      .where('userId', '>', start ?? '')
    [isMax(endUserId) ? 'where' : 'where'](
      'userId',
      isMax(endUserId) ? '>' : '<=',
      isMax(endUserId) ? '' : endUserId,
    )
      .limit(PAGE_SIZE)
      .execute(),
  );
};

main().catch(console.error);


