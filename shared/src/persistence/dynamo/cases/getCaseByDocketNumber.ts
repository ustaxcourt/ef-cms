import { aggregateCaseItems } from '../helpers/aggregateCaseItems';
import { queryFull } from '../../dynamodbClientService';

/**
 * getCaseByDocketNumber
 * gets the full case when contents are under 400 kb
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {object} the case details
 */
export const getCaseByDocketNumber = async ({
  applicationContext,
  consistentRead = false,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  consistentRead?: boolean;
  docketNumber: string;
}) => {
  const caseItems = await queryFull({
    ConsistentRead: consistentRead,
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  return aggregateCaseItems(caseItems);
};
