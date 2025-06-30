import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertUserOnCaseRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';
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
    // TODO 10495: UserOnCaseRecords do not have service indicator or representing so this will wipe out data in dwUserOnCase
    const usersOnCases = userOnCaseRecords.map(userOnCaseRecord => {
      const record = unmarshall(userOnCaseRecord.dynamodb.NewImage);
      const userId = record.pk.split('user|')[1];

      return {
        userId,
        docketNumber: record.docketNumber,
        representing: record.representing ?? [],
        serviceIndicator: record.serviceIndicator ?? undefined,
      };
    });

    await upsertUserOnCaseRecords(usersOnCases);
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process userOnCase record: ${e}`,
    );
  }
};
