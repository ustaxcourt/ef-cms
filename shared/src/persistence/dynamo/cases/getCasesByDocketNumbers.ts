import { batchGet } from '../../dynamodbClientService';
import { uniq } from 'lodash';

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
    keys: uniq(docketNumbers).map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    })),
  });
