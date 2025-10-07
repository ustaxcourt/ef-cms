import { post } from './requests';

/**
 * editRemoteStatusProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.timestamp the timestamp of when the motr was granted
 * @returns {Promise<*>} the promise of the api call
 */
export const editRemoteStatusInteractor = (
  applicationContext,
  { docketNumber, timestamp },
) => {
  return post({
    applicationContext,
    body: { timestamp },
    endpoint: `/case-meta/${docketNumber}/edit-remote-status`,
  });
};
