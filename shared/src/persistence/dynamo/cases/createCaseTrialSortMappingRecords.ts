import { TransactionBuilder } from '../createTransaction';
import { deleteCaseTrialSortMappingRecords } from './deleteCaseTrialSortMappingRecords';
import { put, query } from '../../dynamodbClientService';

/**
 * createCaseTrialSortMappingRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to create the trial sort mapping records for
 * @param {object} providers.caseSortTags the hybrid and nonHybrid sort tags
 */
export const createCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseSortTags,
  docketNumber,
  transaction,
}: {
  applicationContext: IApplicationContext;
  caseSortTags: any;
  docketNumber: string;
  transaction?: TransactionBuilder;
}) => {
  const { hybrid, nonHybrid } = caseSortTags;

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
      omit: [
        { pk: 'eligible-for-trial-case-catalog', sk: nonHybrid },
        { pk: 'eligible-for-trial-case-catalog', sk: hybrid },
      ],
      transaction,
    });
  }

  await Promise.all([
    put({
      Item: {
        docketNumber,
        gsi1pk: `eligible-for-trial-case-catalog|${docketNumber}`,
        pk: 'eligible-for-trial-case-catalog',
        sk: nonHybrid,
      },
      applicationContext,
      transaction,
    }),
    put({
      Item: {
        docketNumber,
        gsi1pk: `eligible-for-trial-case-catalog|${docketNumber}`,
        pk: 'eligible-for-trial-case-catalog',
        sk: hybrid,
      },
      applicationContext,
      transaction,
    }),
  ]);
};
