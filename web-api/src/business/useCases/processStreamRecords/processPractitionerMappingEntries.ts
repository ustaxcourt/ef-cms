import { flattenDeep, merge } from 'lodash';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import type {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { getCaseDataFromDynamo } from '@web-api/business/useCases/processStreamRecords/getCaseDataFromDynamo';
import { upsertPractitionerRecords } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecords';
import { upsertUserOnCaseRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';

export const processPractitionerMappingEntries = async ({
  applicationContext,
  practitionerMappingRecords,
}: {
  applicationContext: ServerApplicationContext;
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords.length) return;

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
  // await upsertUserOnCaseRecords(
  //   practitionerMappingRecords.map(practitionerMappingRecord => {
  //     const practitionerMapping = unmarshall(
  //       practitionerMappingRecord.dynamodb.NewImage,
  //     );

  //     return {
  //       userId: practitionerMapping.userId,
  //       docketNumber: practitionerMapping.docketNumber,
  //       entityName: practitionerMapping.entityName,
  //       representing: practitionerMapping.representing,
  //     };
  //   }),
  // );

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
        caseRecord = await getCaseDataFromPostgres({ docketNumber });
      } catch (e) {
        getLogger().warn(
          `Failed to find case ${practitionerMappingData.pk.S} in postgres in processPractitionerMappingEntries: ${e}.
          If this occurred in a test or as part of re-indexing during a blue-green migration, it is safe to ignore.`,
        );
        caseRecord = await getCaseDataFromDynamo({
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
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const caseMetadataWithCounsel = await getCaseMetadataWithCounsel({
    docketNumber,
  });

  if (!caseMetadataWithCounsel) {
    throw Error(`Unable to index ${docketNumber} case data not found`);
  }

  const marshalledCase = marshall(
    transformNullToUndefined({
      pk: `case|${caseMetadataWithCounsel.docketNumber}`,
      sk: `case|${caseMetadataWithCounsel.docketNumber}`,
      entityName: 'Case',
      caseCaption: caseMetadataWithCounsel.caseCaption,
      associatedJudge: caseMetadataWithCounsel.associatedJudge,
      associatedJudgeId: caseMetadataWithCounsel.associatedJudgeId,
      automaticBlocked: caseMetadataWithCounsel.automaticBlocked,
      automaticBlockedDate: caseMetadataWithCounsel.automaticBlockedDate,
      automaticBlockedReason: caseMetadataWithCounsel.automaticBlockedReason,
      blocked: caseMetadataWithCounsel.blocked,
      blockedDate: caseMetadataWithCounsel.blockedDate,
      blockedReason: caseMetadataWithCounsel.blockedReason,
      caseType: caseMetadataWithCounsel.caseType,
      closedDate: caseMetadataWithCounsel.closedDate,
      createdAt: caseMetadataWithCounsel.createdAt,
      hasPendingItems: caseMetadataWithCounsel.hasPendingItems,
      highPriority: caseMetadataWithCounsel.highPriority,
      isPaper: caseMetadataWithCounsel.isPaper,
      leadDocket: caseMetadataWithCounsel.leadDocketNumber,
      preferredTrialCity: caseMetadataWithCounsel.preferredTrialCity,
      procedureType: caseMetadataWithCounsel.procedureType,
      sealedDate: caseMetadataWithCounsel.sealedDate,
      sortableDocketNumber: caseMetadataWithCounsel.sortableDocketNumber,
      status: caseMetadataWithCounsel.status,
      trialDate: caseMetadataWithCounsel.trialDate,
      trialLocation: caseMetadataWithCounsel.trialLocation,
      docketNumber: caseMetadataWithCounsel.docketNumber,
      docketNumberWithSuffix: caseMetadataWithCounsel.docketNumberWithSuffix,
      isSealed: caseMetadataWithCounsel.isSealed,
      petitioners: caseMetadataWithCounsel.petitioners || [],
      receivedAt: caseMetadataWithCounsel.receivedAt,
      privatePractitioners: caseMetadataWithCounsel.privatePractitioners,
      irsPractitioners: caseMetadataWithCounsel.irsPractitioners,
    }),
    { removeUndefinedValues: true },
  );
  return marshalledCase;
};
