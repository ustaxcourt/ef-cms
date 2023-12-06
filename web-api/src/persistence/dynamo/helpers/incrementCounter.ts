import { getMonthDayYearInETObj } from '../../../../../shared/src/business/utilities/DateHandler';
import { updateConsistent } from '../../dynamodbClientService';
/**
 * incrementCounter
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @param {string} providers.year the year of the item to increment, formatted as YYYY
 * @returns {Promise} the promise of the call to persistence
 */
export const incrementCounter = async ({
  applicationContext,
  key,
  year,
}: {
  applicationContext: IApplicationContext;
  key: string;
  year?: string;
}) => {
  if (!year) {
    year = `${getMonthDayYearInETObj().year}`;
  }

  return (
    await updateConsistent({
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: `${key}-${year}`,
        sk: `${key}-${year}`,
      },
      ReturnValues: 'UPDATED_NEW',
      UpdateExpression: 'ADD #id :value',
      applicationContext,
    })
  ).id;
};
