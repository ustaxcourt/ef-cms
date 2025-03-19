import { deleteCaseTrialSortMappingRecords } from './deleteCaseTrialSortMappingRecords';
import { batchWrite, query } from '../../dynamodbClientService';
import { PutRequest } from '@web-api/persistence/dynamo/dynamoTypes';
import {
  generateTrialSortTags,
  isInConsolidatedGroup,
} from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCasesInConsolidatedGroup } from '@web-api/persistence/postgres/cases/getCasesInConsolidatedGroup';
import { NotFoundError } from '@web-api/errors/errors';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';

export const createCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseSortTags,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
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

  const theCase = await getCaseMetadataByDocketNumber({
    docketNumber,
  });

  if (!theCase) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const isConsolidatedCase = isInConsolidatedGroup(theCase);
  let casesToUpdate: Omit<
    RawCase,
    'consolidatedCases' | 'correspondence' | 'docketEntries' | 'petitioners'
  >[];
  if (isConsolidatedCase) {
    casesToUpdate = await getCasesInConsolidatedGroup({
      leadDocketNumber: theCase.leadDocketNumber!,
    });
  } else {
    casesToUpdate = [theCase];
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
