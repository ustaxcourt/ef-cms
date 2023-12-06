import { aggregateCaseItems } from '../helpers/aggregateCaseItems';
import { get, query } from '../../dynamodbClientService';

/**
 * getCaseByDocketNumber
 * gets the full case when contents are under 400 kb
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {object} the case details
 */
export const getCaseMetadataWithCounsel = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<RawCase> => {
  const caseItems = [
    await get({
      Key: {
        pk: `case|${docketNumber}`,
        sk: `case|${docketNumber}`,
      },
      applicationContext,
    }),

    ...(await query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'privatePractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    })),

    ...(await query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'irsPractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    })),
  ];

  return aggregateCaseItems(caseItems);
};
