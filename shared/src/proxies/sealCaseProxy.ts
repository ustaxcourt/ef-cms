import { put } from './requests';

/**
 * sealCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {Promise<object>} the updated case data
 */
export const sealCaseInteractor = (applicationContext, { docketNumber }) => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/seal`,
  });
};
