import { get } from '../requests';

/**
 * getMessagesForCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} the promise of the api call
 */
export const getMessagesForCaseInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/case/${docketNumber}`,
  });
};
