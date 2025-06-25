import { flattenDeep } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';
import type {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processPractitionerMappingEntries = async ({
  applicationContext,
  practitionerMappingRecords,
}: {
  applicationContext: ServerApplicationContext;
  practitionerMappingRecords: any[];
}) => {
  if (!practitionerMappingRecords.length) return;

  try {
    const indexCaseEntryForPractitionerMapping =
      async practitionerMappingRecord => {
        const practitionerMappingData =
          practitionerMappingRecord.dynamodb.NewImage ||
          practitionerMappingRecord.dynamodb.OldImage;
        const caseRecords: IDynamoDBRecord[] = [];

        const docketNumber = practitionerMappingData.pk.S.substring(
          'case|'.length,
        );

        const caseRecord = await getCaseDataFromPostgres({
          docketNumber,
        });

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

    const indexRecords = await settlePromises(
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
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process practitioner mapping record: ${e}`,
    );
  }
};

const getCaseDataFromPostgres = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const caseMetadataWithCounsels = await getCasesByDocketNumbers({
    docketNumbers: [docketNumber],
    excludeFields: ['docketEntries', 'correspondence', 'hearings'],
  });

  if (!caseMetadataWithCounsels.length) {
    throw Error(`Unable to index ${docketNumber} case data not found`);
  }

  const caseMetadataWithCounsel = caseMetadataWithCounsels[0];

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
