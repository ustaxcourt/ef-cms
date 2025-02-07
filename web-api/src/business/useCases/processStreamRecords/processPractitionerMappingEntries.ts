import { flattenDeep } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';
import type {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { getPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase';

export const processPractitionerMappingEntries = async ({
  applicationContext,
  practitionerMappingRecords,
}: {
  applicationContext: ServerApplicationContext;
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords.length) return;

  const indexCaseEntryForPractitionerMapping =
    async practitionerMappingRecord => {
      const practitionerMappingData =
        practitionerMappingRecord.dynamodb.NewImage ||
        practitionerMappingRecord.dynamodb.OldImage;
      const caseRecords: IDynamoDBRecord[] = [];

      const caseMetadataWithCounsel = await getCaseMetadataWithCounsel({
        applicationContext,
        docketNumber: practitionerMappingData.pk.S.substring('case|'.length),
      });

      if (!caseMetadataWithCounsel) {
        throw Error(
          `Unable to index ${practitionerMappingData.pk.S.substring('case|'.length)} case data not found`,
        );
      }

      const petitionersOnCase = await getPetitionersOnCase({
        docketNumber: caseMetadataWithCounsel.docketNumber,
      });

      const marshalledCase = marshall(
        {
          pk: `case|${caseMetadataWithCounsel.docketNumber}`,
          sk: `case|${caseMetadataWithCounsel.docketNumber}`,
          entityName: 'Case',
          caseCaption: caseMetadataWithCounsel.caseCaption,
          docketNumber: caseMetadataWithCounsel.docketNumber,
          docketNumberWithSuffix:
            caseMetadataWithCounsel.docketNumberWithSuffix,
          isSealed: caseMetadataWithCounsel.isSealed,
          petitioners: petitionersOnCase || [],
          receivedAt: caseMetadataWithCounsel.receivedAt,
        },
        { removeUndefinedValues: true },
      );

      console.log('marshalledCase', marshalledCase);

      caseRecords.push({
        dynamodb: {
          Keys: {
            pk: {
              S: practitionerMappingData.pk.S,
            },
            sk: {
              S: practitionerMappingData.pk.S,
            },
          },
          NewImage: {
            ...marshalledCase,
            case_relations: { name: 'case' },
            entityName: { S: 'CaseDocketEntryMapping' },
          }, // Create a mapping record on the docket-entry index for parent-child relationships
        },
        eventName: 'MODIFY',
      });

      caseRecords.push({
        dynamodb: {
          Keys: {
            pk: {
              S: practitionerMappingData.pk.S,
            },
            sk: {
              S: practitionerMappingData.sk.S,
            },
          },
          NewImage: marshalledCase as { [key: string]: AttributeValueWithName },
        },
        eventName: 'MODIFY',
      });

      return caseRecords;
    };

  const indexRecords = await Promise.all(
    practitionerMappingRecords.map(indexCaseEntryForPractitionerMapping),
  );

  console.log('indexRecords', indexRecords);

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: flattenDeep(indexRecords),
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error(
      'the practitioner mapping record that failed to index',
      { failedRecords },
    );
    throw new Error('failed to index practitioner mapping records');
  }
};
