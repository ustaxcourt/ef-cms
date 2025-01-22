import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { batchWrite, query } from '../../dynamodbClientService';
import { DeleteRequest } from '@web-api/persistence/dynamo/dynamoTypes';

/**
 * deleteCaseTrialSortMappingRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to delete the mapping records for
 * @returns {Promise} the return from the persistence delete calls
 */
export const deleteCaseTrialSortMappingRecords = async ({
  applicationContext,
  docketNumber,
  deleteConsolidatedCases = false,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  deleteConsolidatedCases?: boolean;
}) => {
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
