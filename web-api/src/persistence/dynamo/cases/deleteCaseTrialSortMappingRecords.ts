import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { batchWrite, query } from '../../dynamodbClientService';
import { DeleteRequest } from '@web-api/persistence/dynamo/dynamoTypes';

export const deleteCaseTrialSortMappingRecords = async ({
  applicationContext,
  docketNumber,
  deleteConsolidatedCases = false,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  deleteConsolidatedCases?: boolean;
}): Promise<void> => {
  const docketNumbersToDelete: string[] = [docketNumber];
  const recordsToDelete: DeleteRequest[] = [];
  if (deleteConsolidatedCases) {
    const theCase = await getCaseByDocketNumber({
      applicationContext,
      docketNumber,
      includeConsolidatedCases: true,
    });
    theCase.consolidatedCases.forEach(c =>
      docketNumbersToDelete.push(c.docketNumber),
    );
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
