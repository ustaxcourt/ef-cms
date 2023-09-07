import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { ConsolidatedCaseDTO } from '@shared/business/dto/cases/ConsolidatedCaseDTO';
import {
  aggregateCaseItems,
  aggregateConsolidatedCaseItems,
  isCaseItem,
} from '../helpers/aggregateCaseItems';
import { queryFull } from '../../dynamodbClientService';

export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
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
  });

  const leadDocketNumber = caseItems.find((caseItem): caseItem is CaseRecord =>
    isCaseItem(caseItem),
  )?.leadDocketNumber;
  let consolidatedCases: ConsolidatedCaseDTO[] = [];
  if (leadDocketNumber) {
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

  return { ...aggregateCaseItems(caseItems), consolidatedCases };
};
