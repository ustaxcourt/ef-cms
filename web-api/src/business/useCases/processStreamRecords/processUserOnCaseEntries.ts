import { unmarshall } from '@aws-sdk/util-dynamodb';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';
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
    await userOnCaseRecords.forEach(async userOnCaseRecord => {
      const record = unmarshall(userOnCaseRecord.dynamodb.NewImage);

      await associateUserWithCase({
        userId: record.userId,
        docketNumber: record.docketNumber,
        entityName: record.entityName,
        representing: record.representing ?? [],
        serviceIndicator: record.serviceIndicator ?? undefined,
      });
    });
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process userOnCase record: ${e}`,
    );
  }
};
