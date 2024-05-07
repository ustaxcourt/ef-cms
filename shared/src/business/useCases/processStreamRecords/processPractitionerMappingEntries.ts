import { flattenDeep } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';
import type {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@shared/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';

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

      const caseMetadataWithCounsel = await applicationContext
        .getPersistenceGateway()
        .getCaseMetadataWithCounsel({
          applicationContext,
          docketNumber: practitionerMappingData.pk.S.substring('case|'.length),
        });

      const marshalledCase = marshall(caseMetadataWithCounsel);

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
