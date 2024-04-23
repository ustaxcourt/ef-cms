import { post } from '../requests';

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber docket number for serving a case
 * @returns {Promise<*>} the promise of the api call
 */
export const serveCaseToIrsInteractor = (
  applicationContext,
  { clientConnectionId, docketNumber },
) => {
  return post({
    applicationContext,
    body: { clientConnectionId },
    endpoint: `/async/cases/${docketNumber}/serve-to-irs`,
  });
};
