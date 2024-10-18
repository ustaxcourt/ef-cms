import { ServerApplicationContext } from '@web-api/applicationContext';
import { batchDelete, query } from '../../dynamodbClientService';

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
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}) => {
  const records = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `eligible-for-trial-case-catalog|${docketNumber}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  await batchDelete({
    applicationContext,
    items: records,
  });
};
