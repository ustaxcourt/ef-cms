import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertUserOnCaseRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processPractitionerMappingEntries = async ({
  practitionerMappingRecords,
}: {
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords?.length) return;
  try {
    await upsertUserOnCaseRecords(
      practitionerMappingRecords.map(practitionerMappingRecord => {
        const userOnCaseRecord = unmarshall(
          practitionerMappingRecord.dynamodb.NewImage,
        );

        const docketNumber = userOnCaseRecord.pk.split('|')[1];

        return {
          docketNumber,
          userId: userOnCaseRecord.userId,
          representing: userOnCaseRecord.representing,
          serviceIndicator: userOnCaseRecord.serviceIndicator,
        };
      }),
    );
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process practitioner mapping record:`,
      e,
    );
    throw new Error('failed to index practitioner mapping records');
  }
};
