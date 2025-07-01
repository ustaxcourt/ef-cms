import { getDbWriter } from '@web-api/database';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';

export const upsertUserOnCasePendingRecords = async (
  userOnCaseRecords: Array<{
    userId: string;
    docketNumber: string;
  }>,
) => {
  return await getDbWriter({
    cb: async writer => {
      return writer
        .insertInto('dwUserOnCasePending')
        .values(userOnCaseRecords)
        .onConflict(oc => oc.columns(['userId', 'docketNumber']).doNothing())
        .returningAll()
        .execute();
    },
    table: 'dwUserOnCase',
    action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
  });
};
