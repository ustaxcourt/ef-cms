import { deleteCaseTrialSortMappingRecords } from './deleteCaseTrialSortMappingRecords';
import { batchWrite, query, queryFull } from '../../dynamodbClientService';
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
  PutRequest,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { isCaseItem } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';
import {
  generateTrialSortTags,
  isInConsolidatedGroup,
} from '@shared/business/entities/cases/Case';

export const createCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseSortTags,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  caseSortTags: { hybrid: string; nonHybrid: string };
  docketNumber: string;
}): Promise<void> => {
  const oldSortRecords = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `eligible-for-trial-case-catalog|${docketNumber}`,
      ':pk': 'eligible-for-trial-case-catalog',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk AND #pk = :pk',
    applicationContext,
  });

  if (oldSortRecords.length) {
    await deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber,
    });
  }

  const theCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });
  const isConsolidatedCase = isInConsolidatedGroup(theCase);
  const casesToUpdate: (RawCase | CaseRecord)[] = [];
  if (isConsolidatedCase) {
    const consolidatedCaseItems = await queryFull<
      IrsPractitionerOnCaseRecord | PrivatePractitionerOnCaseRecord | CaseRecord
    >({
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': `leadCase|${theCase.leadDocketNumber!}`,
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      applicationContext,
    });
    consolidatedCaseItems
      .filter((item): item is CaseRecord => isCaseItem(item))
      .forEach(c => {
        casesToUpdate.push(c);
      });
  } else {
    casesToUpdate.push(theCase);
  }

  const hasBlockedCase = casesToUpdate.some(c => {
    if (c.docketNumber === docketNumber) return false;
    return c.blocked || c.automaticBlocked;
  });

  if (hasBlockedCase) {
    return;
  }

  const recordsToAdd: PutRequest[] = [];

  casesToUpdate.forEach(c => {
    const { hybrid, nonHybrid } =
      c.docketNumber === docketNumber ? caseSortTags : generateTrialSortTags(c);
    recordsToAdd.push({
      PutRequest: {
        Item: {
          docketNumber: c.docketNumber,
          gsi1pk: `eligible-for-trial-case-catalog|${c.docketNumber}`,
          pk: 'eligible-for-trial-case-catalog',
          sk: nonHybrid,
        },
      },
    });
    recordsToAdd.push({
      PutRequest: {
        Item: {
          docketNumber: c.docketNumber,
          gsi1pk: `eligible-for-trial-case-catalog|${c.docketNumber}`,
          pk: 'eligible-for-trial-case-catalog',
          sk: hybrid,
        },
      },
    });
  });

  await batchWrite(recordsToAdd, applicationContext);
};
