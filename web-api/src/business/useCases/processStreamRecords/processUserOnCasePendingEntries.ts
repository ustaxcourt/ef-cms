import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertUserOnCasePendingRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCasePendingRecords';

export const processUserOnCasePendingEntries = async ({
  userOnCasePendingRecords,
}: {
  userOnCasePendingRecords: any[];
}) => {
  if (!userOnCasePendingRecords.length) return;

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
