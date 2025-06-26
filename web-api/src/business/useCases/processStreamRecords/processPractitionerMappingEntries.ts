import { merge } from 'lodash';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertPractitionerRecords } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecords';
import { upsertUserOnCaseRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processPractitionerMappingEntries = async ({
  practitionerMappingRecords,
}: {
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords?.length) return;
  try {
    await upsertPractitionerRecords(
      practitionerMappingRecords.map(practitionerMappingRecord => {
        const practitioner = unmarshall(
          practitionerMappingRecord.dynamodb.NewImage,
        );

        const { contact, ...rest } = practitioner;
        const flatPractitioner = merge({}, rest, contact || {});

        return flatPractitioner;
      }),
    );

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
      `Postgres re-indexing failure: Failed to process practitioner mapping record: ${e}`,
    );
  }
};
