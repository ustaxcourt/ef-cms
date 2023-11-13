import { Case } from '@shared/business/entities/cases/Case';
import { batchGet } from '../../dynamodbClientService';

/**
 * getCasesByDocketNumbers
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.docketNumbers the docket numbers to get
 * @returns {Array} the case details
 */
export const getCasesByDocketNumbers = async ({
  applicationContext,
  docketNumbers,
}) => {
  const results = await batchGet({
    applicationContext,
    keys: docketNumbers.map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    })),
  });

  return results.map(c => new Case(c, { applicationContext }).toRawObject());
};
