import { getRecordsViaMapping } from '../helpers/getRecordsViaMapping';

/**
 * getCaseDeadlinesByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get the case deadlines for
 * @returns {Promise} the promise of the persistence call to get the records
 */
export const getCaseDeadlinesByDocketNumber = ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}) =>
  getRecordsViaMapping({
    applicationContext,
    pk: `case|${docketNumber}`,
    prefix: 'case-deadline',
  });
