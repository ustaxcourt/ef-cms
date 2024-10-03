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
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { queryFull } from '../../dynamodbClientService';

export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
  includeConsolidatedCases = true,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  includeConsolidatedCases?: boolean;
}): Promise<RawCase> => {
  const [caseItems, workItems] = await Promise.all([
    queryFull({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
      },
      KeyConditionExpression: '#pk = :pk',
      applicationContext,
    }),
    getWorkItemsByDocketNumber({
      docketNumber,
    }),
  ]);

  const leadDocketNumber = caseItems.find((caseItem): caseItem is CaseRecord =>
    isCaseItem(caseItem),
  )?.leadDocketNumber;
  let consolidatedCases: RawConsolidatedCaseSummary[] = [];
  if (leadDocketNumber && includeConsolidatedCases) {
    const consolidatedCaseItems = await queryFull<
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

    consolidatedCases = aggregateConsolidatedCaseItems(consolidatedCaseItems);
  }

  return purgeDynamoKeys({
    ...aggregateCaseItems([
      ...caseItems,
      ...workItems.map(workItem => ({
        ...workItem,
        pk: `case|${docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      })),
    ]),
    consolidatedCases,
  });
};
