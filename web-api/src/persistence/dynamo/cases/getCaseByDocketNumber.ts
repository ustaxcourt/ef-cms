import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { RawConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import {
  aggregateCaseItems,
  aggregateConsolidatedCaseItems,
  isCaseItem,
} from '../helpers/aggregateCaseItems';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { getCaseByDocketNumberPostgres } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { queryFull } from '../../dynamodbClientService';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { caseContactAddressSealedFormatter } from '@shared/business/utilities/caseFilter';

// These case items are no longer in dynamoDB
const SK_FILTER_OUT = ['work-item', 'correspondence'];

export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
  includeConsolidatedCases = true,
  includeCorrespondenceAndWorkItems = true,
  user = undefined, // Only needed to check permissions on sealed addresses for consolidated cases
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  includeConsolidatedCases?: boolean;
  includeCorrespondenceAndWorkItems?: boolean;
  user?: UnknownAuthUser;
}): Promise<RawCase> => {
  const caseItems = await queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  }).then(items =>
    items.filter(
      item => !SK_FILTER_OUT.some(prefix => item.sk.startsWith(prefix)),
    ),
  );

  /*
    We have roughly three options to get all data associated with a case:
    1) Separate queries for each aspect of a case. This is easier to understand but introduces network latency.
    2) One big query with json aggregation to handle duplication across joins. This reduces network latency and reduces code here but makes for a complex query.
    3) One big query that relies on code here to handle duplication across joins. This reduces network latency but means we have to run code to clean the data.
    (Bonus 4: We introduce a finer-grained way of asking for exactly what case data is needed rather than getting it all by default.)
    Below, we do 3.
  */
  let workItems: RawWorkItem[] = [];
  let correspondences: RawCorrespondence[] = [];
  if (includeCorrespondenceAndWorkItems) {
    const postgresCaseData =
      (await getCaseByDocketNumberPostgres(docketNumber)) || [];

    const workItemsMap = new Map<string, any>();
    const correspondencesMap = new Map<string, any>();

    for (const row of postgresCaseData) {
      if (row.workItemId && !workItemsMap.has(row.workItemId)) {
        workItemsMap.set(
          row.workItemId,
          workItemEntity({
            assigneeId: row.assigneeId,
            assigneeName: row.assigneeName,
            associatedJudge: row.associatedJudge,
            associatedJudgeId: row.associatedJudgeId,
            caption: row.caption,
            caseIsInProgress: row.caseIsInProgress,
            completedAt: row.completedAt,
            completedBy: row.completedBy,
            completedByUserId: row.completedByUserId,
            completedMessage: row.completedMessage,
            createdAt: row.createdAt,
            docketEntry: row.docketEntry,
            docketNumber,
            hideFromPendingMessages: row.hideFromPendingMessages,
            highPriority: row.highPriority,
            inProgress: row.inProgress,
            isInitializeCase: row.isInitializeCase,
            isRead: row.isRead,
            section: row.section,
            sentBy: row.sentBy,
            sentBySection: row.sentBySection,
            sentByUserId: row.sentByUserId,
            updatedAt: row.updatedAt,
            workItemId: row.workItemId,
          }),
        );
      }

      if (
        row.correspondenceId &&
        !correspondencesMap.has(row.correspondenceId)
      ) {
        correspondencesMap.set(
          row.correspondenceId,
          caseCorrespondenceEntity({
            archived: row.archived,
            correspondenceId: row.correspondenceId,
            docketNumber,
            documentTitle: row.documentTitle,
            filedBy: row.filedBy,
            filingDate: row.filingDate,
            userId: row.userId,
          }),
        );
      }
    }

    workItems = Array.from(workItemsMap.values());
    correspondences = Array.from(correspondencesMap.values());
  }

  const leadDocketNumber = caseItems.find((caseItem): caseItem is CaseRecord =>
    isCaseItem(caseItem),
  )?.leadDocketNumber;
  let consolidatedCases: RawConsolidatedCaseSummary[] = [];
  if (leadDocketNumber && includeConsolidatedCases) {
    let consolidatedCaseItems = await queryFull<
      IrsPractitionerOnCaseRecord | PrivatePractitionerOnCaseRecord | CaseRecord
    >({
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': `leadCase|${leadDocketNumber}`,
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      applicationContext,
    });

    if (user) {
      consolidatedCaseItems = consolidatedCaseItems.map(c =>
        caseContactAddressSealedFormatter(c, user),
      );
    }

    consolidatedCases = aggregateConsolidatedCaseItems(consolidatedCaseItems);
  }

  return purgeDynamoKeys({
    ...aggregateCaseItems([
      ...caseItems,
      ...correspondences.map(correspondenceItem => ({
        ...correspondenceItem,
        pk: `case|${docketNumber}`,
        sk: `correspondence|${correspondenceItem.correspondenceId}`,
      })),
      ...workItems.map(workItem => ({
        ...workItem,
        pk: `case|${docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      })),
    ]),
    consolidatedCases,
  });
};
