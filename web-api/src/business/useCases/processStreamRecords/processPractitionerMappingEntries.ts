import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertPractitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPractitionersOnCase';

export const processPractitionerMappingEntries = async ({
  practitionerMappingRecords,
}: {
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords.length) return;

  // const indexCaseEntryForPractitionerMapping =
  //   async practitionerMappingRecord => {
  //     const practitionerMappingData =
  //       practitionerMappingRecord.dynamodb.NewImage ||
  //       practitionerMappingRecord.dynamodb.OldImage;
  //     const caseRecords: IDynamoDBRecord[] = [];

  //     const caseMetadataWithCounsel = await getCaseMetadataWithCounsel({
  //       applicationContext,
  //       docketNumber: practitionerMappingData.pk.S.substring('case|'.length),
  //     });

  //   const marshalledCase = caseMetadataWithCounsel;

  //   caseRecords.push({
  //     dynamodb: {
  //       Keys: {
  //         pk: {
  //           S: practitionerMappingData.pk.S,
  //         },
  //         sk: {
  //           S: practitionerMappingData.pk.S,
  //         },
  //       },
  //       NewImage: {
  //         ...marshalledCase,
  //         case_relations: { name: 'case' },
  //         entityName: { S: 'CaseDocketEntryMapping' },
  //       }, // Create a mapping record on the docket-entry index for parent-child relationships
  //     },
  //     eventName: 'MODIFY',
  //   });

  //   caseRecords.push({
  //     dynamodb: {
  //       Keys: {
  //         pk: {
  //           S: practitionerMappingData.pk.S,
  //         },
  //         sk: {
  //           S: practitionerMappingData.sk.S,
  //         },
  //       },
  //       NewImage: marshalledCase as { [key: string]: AttributeValueWithName },
  //     },
  //     eventName: 'MODIFY',
  //   });

  //   return caseRecords;
  // };

  // const indexRecords = await Promise.all(
  //   practitionerMappingRecords.map(indexCaseEntryForPractitionerMapping),
  // );

  // const { failedRecords } = await applicationContext
  //   .getPersistenceGateway()
  //   .bulkIndexRecords({
  //     applicationContext,
  //     records: flattenDeep(indexRecords),
  //   });

  // if (failedRecords.length > 0) {
  //   applicationContext.logger.error(
  //     'the practitioner mapping record that failed to index',
  //     { failedRecords },
  //   );
  //   throw new Error('failed to index practitioner mapping records');
  // }

  const getDocketNumberFromPractitionerMappingRecord = record => {
    const practitionerMappingData =
      record.dynamodb.NewImage || record.dynamodb.OldImage;

    return practitionerMappingData.pk.S.substring('case|'.length);
  };
  // console.log('practitionerMappingRecords', practitionerMappingRecords);

  await upsertPractitionersOnCase({
    practitionersWithDocketNumber: practitionerMappingRecords.map(p => {
      console.log('unmarshalled NewImage', p.dynamodb.NewImage);
      return {
        ...unmarshall(p.dynamodb.NewImage), // 10502 TODO, this is probably wrong
        docketNumber: getDocketNumberFromPractitionerMappingRecord(p),
      };
    }),
  });
};
