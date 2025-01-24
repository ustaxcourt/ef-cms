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
import { caseContactAddressSealedFormatter } from '@shared/business/utilities/caseFilter';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

// These case items are no longer in dynamoDB
const SK_FILTER_OUT = ['work-item'];

export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
  includeConsolidatedCases = true,
  user = undefined, // Only needed to check permissions on sealed addresses for consolidated cases
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  includeConsolidatedCases?: boolean;
  user?: UnknownAuthUser;
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
    }).then(items =>
      items.filter(
        item => !SK_FILTER_OUT.some(prefix => item.sk.startsWith(prefix)),
      ),
    ),
    getWorkItemsByDocketNumber({
      docketNumber,
    }),
  ]);

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
      ...workItems.map(workItem => ({
        ...workItem,
        pk: `case|${docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      })),
    ]),
    consolidatedCases,
  });
};
