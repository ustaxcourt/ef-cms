import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertUserOnCasePendingRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCasePendingRecords';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const processUserOnCasePendingEntries = async ({
  userOnCasePendingRecords,
}: {
  userOnCasePendingRecords: any[];
}) => {
  if (!userOnCasePendingRecords?.length) return;

  getLogger().debug(
    `going to upsert ${userOnCasePendingRecords.length} userOnCasePending records`,
  );

  await upsertUserOnCasePendingRecords(
    userOnCasePendingRecords.map(userOnCasePendingRecord => {
      const record = unmarshall(userOnCasePendingRecord.dynamodb.NewImage);

      return {
        userId: record.userId,
        docketNumber: record.docketNumber,
      };
    }),
  );
};
