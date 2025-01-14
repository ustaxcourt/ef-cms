import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertPractitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPractitionersOnCase';

export const processPractitionerMappingEntries = async ({
  practitionerMappingRecords,
}: {
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords.length) return;
  const getDocketNumberFromPractitionerMappingRecord = record => {
    const practitionerMappingData =
      record.dynamodb.NewImage || record.dynamodb.OldImage;

    return practitionerMappingData.pk.S.substring('case|'.length);
  };

  await upsertPractitionersOnCase({
    practitionersWithDocketNumber: practitionerMappingRecords.map(p => {
      return {
        ...(unmarshall(p.dynamodb.NewImage) as RawPractitioner),
        docketNumber: getDocketNumberFromPractitionerMappingRecord(p),
      };
    }),
  });
};
