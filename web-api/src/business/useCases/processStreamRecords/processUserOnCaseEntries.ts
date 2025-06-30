import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getDbWriter } from '@web-api/database';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processUserOnCaseEntries = async ({
  userOnCaseRecords,
}: {
  userOnCaseRecords: any[];
}) => {
  if (!userOnCaseRecords?.length) return;

  getDawsonLogger().debug(
    `going to upsert ${userOnCaseRecords.length} userOnCase records`,
  );

  try {
    const usersOnCases = userOnCaseRecords.map(userOnCaseRecord => {
      const record = unmarshall(userOnCaseRecord.dynamodb.NewImage);
      const userId = record.pk.split('user|')[1];

      return {
        userId,
        docketNumber: record.docketNumber,
      };
    });

    // instead of using upsertUserOnCaseRecords we manually do this so we can ignore any existing records
    // to prevent the representing array from being overridden.
    return await getDbWriter({
      cb: async writer => {
        return writer
          .insertInto('dwUserOnCase')
          .values(usersOnCases)
          .onConflict(oc => oc.columns(['userId', 'docketNumber']).doNothing())
          .returningAll()
          .execute();
      },
      table: 'dwUserOnCase',
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    });
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process userOnCase record: ${e}`,
    );
  }
};
