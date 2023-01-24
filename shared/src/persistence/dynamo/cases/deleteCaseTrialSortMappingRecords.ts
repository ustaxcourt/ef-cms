import { TransactionBuilder } from '../createTransaction';
import { query, remove } from '../../dynamodbClientService';

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
  omit = [],
  transaction,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  omit?: any[];
  transaction?: TransactionBuilder;
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

  const clientDelete = record => {
    return remove({
      applicationContext,
      key: {
        pk: record.pk,
        sk: record.sk,
      },
      transaction,
    });
  };

  const results = await Promise.all(
    records
      .filter(record => {
        return !omit.some(({ pk, sk }) => record.pk === pk && record.sk === sk);
      })
      .map(clientDelete),
  );

  return results;
};
