import { marshall } from '@aws-sdk/util-dynamodb';
import {
  IDynamoDBRecord,
  AttributeValueWithName,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { applicationContext } from '@web-api/applicationContext';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getLogger } from 'aws-xray-sdk';
import { flattenDeep, isArray } from 'lodash';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { UserOnCaseKysely } from '@web-api/persistence/postgres/users/schema';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { NotFoundError } from '@web-api/errors/errors';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getUserByIdDynamo } from '@web-api/persistence/dynamo/getUserByIdDynamo';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const transformOpenSearchUserOnCase = (
  userOnCaseData: UserOnCaseKysely | UserOnCaseKysely[],
) => {
  const users = isArray(userOnCaseData) ? userOnCaseData : [userOnCaseData];
  return users.map(userOnCase => {
    return {
      userId: userOnCase.userId,
      docketNumber: userOnCase.docketNumber,
    };
  });
};

export const indexOpenSearchUserOnCase = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  const caseRecords: IDynamoDBRecord[] = [];
  for (const { userId, docketNumber } of isArray(message.payload)
    ? message.payload
    : [message.payload]) {
    let userRecord;

    try {
      userRecord = await getUserById({ userId });
      if (!userRecord) {
        throw new Error('Unable to find user in postgres');
      }
    } catch (e) {
      userRecord = await getUserByIdDynamo({ userId });
    }

    if (!userRecord) {
      throw new NotFoundError(`Could not find user ${userId}`);
    }

    if (
      userRecord.role !== ROLES.irsPractitioner &&
      userRecord.role !== ROLES.privatePractitioner &&
      userRecord.role !== ROLES.inactivePractitioner
    )
      return;

    const caseRecord = await getCaseDataFromPostgres({
      docketNumber,
    });

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: `case|${docketNumber}`,
          },
          sk: {
            S: `case|${docketNumber}`,
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
            S: `case|${docketNumber}`,
          },
          sk: {
            S: `${userRecord.role}|${userRecord.userId}`,
          },
        },
        NewImage: caseRecord as { [key: string]: AttributeValueWithName },
      },
      eventName: 'MODIFY',
    });
  }

  try {
    const { failedRecords } = await applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords({
        applicationContext,
        records: flattenDeep(caseRecords),
      });

    if (failedRecords.length > 0) {
      applicationContext.logger.error(
        'the userOnCase mapping record that failed to index',
        { failedRecords },
      );
      throw new Error('failed to index userOnCase mapping records');
    }
  } catch (e) {
    getLogger().error(
      `Postgres re-indexing failure: Failed to process userOnCase mapping record: ${e}`,
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
    excludeFields: ['docketEntries', 'hearings', 'correspondence'],
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
