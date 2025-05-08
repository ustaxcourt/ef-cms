import { batchWrite, query } from '../../dynamodbClientService';
import { DeleteRequest } from '@web-api/persistence/dynamo/dynamoTypes';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError } from '@web-api/errors/errors';
import { isInConsolidatedGroup } from '@shared/business/entities/cases/Case';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const deleteCaseTrialSortMappingRecords = async ({
  applicationContext,
  docketNumber,
  deleteConsolidatedCases = false,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
  deleteConsolidatedCases?: boolean;
}): Promise<void> => {
  let docketNumbersToDelete: string[] = [docketNumber];
  const theCase = (
    await getCasesByDocketNumbers({
      docketNumbers: [docketNumber],
      excludeFields: [
        'hearings',
        'correspondence',
        'docketEntries',
        'irsPractitioners',
        'privatePractitioners',
      ],
    })
  )[0];

  if (!theCase) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const recordsToDelete: DeleteRequest[] = [];
  if (deleteConsolidatedCases && isInConsolidatedGroup(theCase)) {
    docketNumbersToDelete = (
      await getConsolidatedCases({
        leadDocketNumber: theCase.leadDocketNumber!,
        excludeFields: [
          'correspondence',
          'docketEntries',
          'hearings',
          'irsPractitioners',
          'privatePractitioners',
        ],
      })
    ).map(c => c.docketNumber);
  }
  await Promise.all(
    docketNumbersToDelete.map(async dn => {
      const records = await query({
        ExpressionAttributeNames: {
          '#gsi1pk': 'gsi1pk',
        },
        ExpressionAttributeValues: {
          ':gsi1pk': `eligible-for-trial-case-catalog|${dn}`,
        },
        IndexName: 'gsi1',
        KeyConditionExpression: '#gsi1pk = :gsi1pk',
        applicationContext,
      });

      records.forEach(r => {
        recordsToDelete.push({
          DeleteRequest: { Key: { pk: r.pk, sk: r.sk } },
        });
      });
    }),
  );
  await batchWrite(recordsToDelete, applicationContext);
};
