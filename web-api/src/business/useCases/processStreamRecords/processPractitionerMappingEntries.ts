import { flattenDeep } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';
import type {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { get, query } from '@web-api/persistence/dynamodbClientService';
import { aggregateCaseItems } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';

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

      const docketNumber = practitionerMappingData.pk.S.substring(
        'case|'.length,
      );

      // After case records have been moved into postgres, we need to get the case data associated with the practitioner from postgres.
      // However, when we try to fetch case data here during the initial blue-green migration re-indexing step (to get case records
      // into postgres in the first place), the case data might not yet have been moved over to postgres. Therefore, we fallback to the case data from Dynamo.
      // TODO after 10502: Only rely on postgres by in-lining getCaseDataFromPostgres here.
      let caseRecord: any;
      try {
        caseRecord = await getCaseDataFromPostgres({
          applicationContext,
          docketNumber,
        });
      } catch (e) {
        getLogger().warn(
          `Failed to find case ${practitionerMappingData.pk.S} in postgres in processPractitionerMappingEntries: ${e}.
          If this occurred in a test or as part of re-indexing during a blue-green migration, it is safe to ignore.`,
        );
        caseRecord = await exports.getCaseDataFromDynamo({
          applicationContext,
          docketNumber,
        });
      }

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
            ...caseRecord,
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
          NewImage: caseRecord as { [key: string]: AttributeValueWithName },
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

const getCaseDataFromPostgres = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}) => {
  const caseMetadataWithCounsel = await getCaseMetadataWithCounsel({
    applicationContext,
    docketNumber,
  });

  if (!caseMetadataWithCounsel) {
    throw Error(`Unable to index ${docketNumber} case data not found`);
  }

  const marshalledCase = marshall(
    {
      pk: `case|${caseMetadataWithCounsel.docketNumber}`,
      sk: `case|${caseMetadataWithCounsel.docketNumber}`,
      entityName: 'Case',
      caseCaption: caseMetadataWithCounsel.caseCaption,
      caseType: caseMetadataWithCounsel.caseType,
      docketNumber: caseMetadataWithCounsel.docketNumber,
      docketNumberWithSuffix: caseMetadataWithCounsel.docketNumberWithSuffix,
      isSealed: caseMetadataWithCounsel.isSealed,
      petitioners: caseMetadataWithCounsel.petitioners || [],
      receivedAt: caseMetadataWithCounsel.receivedAt,
      privatePractitioners: caseMetadataWithCounsel.privatePractitioners,
      irsPractitioners: caseMetadataWithCounsel.irsPractitioners,
    },
    { removeUndefinedValues: true },
  );
  return marshalledCase;
};

// TODO: Delete after 10502 is finished
export const getCaseDataFromDynamo = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}) => {
  const caseItems = [
    await get({
      Key: {
        pk: `case|${docketNumber}`,
        sk: `case|${docketNumber}`,
      },
      applicationContext,
    }),

    ...(await query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'privatePractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    })),

    ...(await query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'irsPractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    })),
  ];

  const unmarshalledCase = aggregateCaseItems(caseItems);
  return marshall(unmarshalledCase);
};
