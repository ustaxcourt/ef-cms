import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
  TDynamoRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { ConsolidatedCaseDTO } from '@shared/business/dto/cases/ConsolidatedCaseDTO';
import {
  aggregateCaseItems,
  isCaseItem,
  isIrsPractitionerItem,
  isPrivatePractitionerItem,
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
        ':gsi1pk': `case|${leadDocketNumber}`,
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      applicationContext,
    });

    consolidatedCases = aggregateConsolidatedCases(consolidatedCaseItems);
  }

  return { ...aggregateCaseItems(caseItems), consolidatedCases };
};

const aggregateConsolidatedCases = (
  consolidatedCaseItems: TDynamoRecord<
    IrsPractitionerOnCaseRecord | PrivatePractitionerOnCaseRecord | CaseRecord
  >[],
): ConsolidatedCaseDTO[] => {
  const caseMap: Map<string, ConsolidatedCaseDTO> = new Map();
  consolidatedCaseItems
    .filter((item): item is CaseRecord => isCaseItem(item))
    .forEach(item => caseMap.set(item.pk, new ConsolidatedCaseDTO(item)));

  consolidatedCaseItems.forEach(item => {
    if (isIrsPractitionerItem(item)) {
      caseMap.get(item.pk)?.irsPractitioners.push(item);
    }
    if (isPrivatePractitionerItem(item)) {
      caseMap.get(item.pk)?.privatePractitioners.push(item);
    }
  });

  return [...caseMap.values()];
};
