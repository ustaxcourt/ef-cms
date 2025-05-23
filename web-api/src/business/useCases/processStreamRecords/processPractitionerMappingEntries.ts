import { merge } from 'lodash';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertPractitionerRecords } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecords';
import { upsertUserOnCaseRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';

export const processPractitionerMappingEntries = async ({
  practitionerMappingRecords,
}: {
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords?.length) return;
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
        entityName: userOnCaseRecord.entityName,
        representing: userOnCaseRecord.representing,
      };
    }),
  );
};
