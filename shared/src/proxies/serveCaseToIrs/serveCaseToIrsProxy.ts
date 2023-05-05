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
  { docketNumber },
) => {
  return post({
    applicationContext,
    endpoint: `/cases/${docketNumber}/serve-to-irs`,
  });
};
