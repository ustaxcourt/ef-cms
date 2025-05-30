import { unmarshall } from '@aws-sdk/util-dynamodb';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const processUserOnCaseEntries = async ({
  userOnCaseRecords,
}: {
  userOnCaseRecords: any[];
}) => {
  if (!userOnCaseRecords?.length) return;

  getLogger().debug(
    `going to upsert ${userOnCaseRecords.length} userOnCase records`,
  );

  try {
    await userOnCaseRecords.forEach(async userOnCaseRecord => {
      const record = unmarshall(userOnCaseRecord.dynamodb.NewImage);

      await associateUserWithCase({
        userId: record.userId,
        docketNumber: record.docketNumber,
        entityName: record.entityName,
      });
    });
  } catch (e) {
    getLogger().error(
      `Postgres re-indexing failure: Failed to process userOnCase record: ${e}`,
    );
  }
};
