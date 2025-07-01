import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertUserOnCasePendingRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCasePendingRecords';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processUserOnCasePendingEntries = async ({
  userOnCasePendingRecords,
}: {
  userOnCasePendingRecords: any[];
}) => {
  if (!userOnCasePendingRecords?.length) return;

  getDawsonLogger().debug(
    `going to upsert ${userOnCasePendingRecords.length} userOnCasePending records`,
  );

  try {
    await upsertUserOnCasePendingRecords(
      userOnCasePendingRecords.map(userOnCasePendingRecord => {
        const record = unmarshall(userOnCasePendingRecord.dynamodb.NewImage);
        const userId = record.pk.split('|')[1];
        const docketNumber = record.sk.split('|')[1];

        return {
          userId,
          docketNumber,
        };
      }),
    );
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process userOnCasePending record:`,
      e,
    );
  }
};
