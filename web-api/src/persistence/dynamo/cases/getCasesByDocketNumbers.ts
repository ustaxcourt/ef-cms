import { batchGet } from '../../dynamodbClientService';

/**
 * getCasesByDocketNumbers
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.docketNumbers the docket numbers to get
 * @returns {Array} the case details
 */
export const getCasesByDocketNumbers = ({
  applicationContext,
  docketNumbers,
}) =>
  batchGet({
    applicationContext,
    keys: docketNumbers.map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    })),
  });
