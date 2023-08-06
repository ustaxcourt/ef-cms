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
}: {
  applicationContext: IApplicationContext;
  caseSortTags: any;
  docketNumber: string;
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
    }),
    put({
      Item: {
        docketNumber,
        gsi1pk: `eligible-for-trial-case-catalog|${docketNumber}`,
        pk: 'eligible-for-trial-case-catalog',
        sk: hybrid,
      },
      applicationContext,
    }),
  ]);
};
