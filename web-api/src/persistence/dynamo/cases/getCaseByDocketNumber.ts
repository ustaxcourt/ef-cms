import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { RawConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import {
  aggregateCaseItems,
  aggregateConsolidatedCaseItems,
  isCaseItem,
} from '../helpers/aggregateCaseItems';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { getDbReader } from '@web-api/database';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { queryFull } from '../../dynamodbClientService';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';

export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
  includeConsolidatedCases = true,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  includeConsolidatedCases?: boolean;
}): Promise<RawCase> => {
  try {
    const caseItems = await queryFull({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
      },
      KeyConditionExpression: '#pk = :pk',
      applicationContext,
    });

    /*
    We have roughly three options to get all data associated with a case:
    1) Separate queries for each aspect of a case. This is easier to understand but introduces network latency.
    2) One big query with json aggregation to handle duplication across joins. This reduces network latency and reduces code here but makes for a complex query.
    3) One big query that relies on code here to handle duplication across joins. This reduces network latency but means we have to run code to clean the data.
    (Bonus 4: We introduce a finer-grained way of asking for exactly what case data is needed rather than getting it all by default.)
    Below, we do 3.
  */
    const postgresCaseData = await getDbReader(reader => {
      return reader
        .selectFrom('dwCase as c')
        .leftJoin('dwWorkItem as d', 'd.docketNumber', 'c.docketNumber')
        .leftJoin(
          'dwCaseCorrespondence as co',
          'c.docketNumber',
          'co.docketNumber',
        )
        .where('c.docketNumber', '=', docketNumber)
        .selectAll()
        .select('c.docketNumber')
        .execute();
    });

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

    const workItems = Array.from(workItemsMap.values());
    const correspondences = Array.from(correspondencesMap.values());

    const leadDocketNumber = caseItems.find(
      (caseItem): caseItem is CaseRecord => isCaseItem(caseItem),
    )?.leadDocketNumber;
    let consolidatedCases: RawConsolidatedCaseSummary[] = [];
    if (leadDocketNumber && includeConsolidatedCases) {
      const consolidatedCaseItems = await queryFull<
        | IrsPractitionerOnCaseRecord
        | PrivatePractitionerOnCaseRecord
        | CaseRecord
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
  } catch (e) {
    console.log(e);
  }
  return {} as RawCase;
};
