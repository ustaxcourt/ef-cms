import { get } from '../requests';

/**
 * getPublicDownloadPolicyUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the docket entry
 * @param {string} providers.key the key of the document to get
 * @returns {Promise<*>} the promise of the api call
 */
export const getPublicDownloadPolicyUrl = ({
  applicationContext,
  docketNumber,
  key,
}) => {
  return get({
    applicationContext,
    endpoint: `/public-api/${docketNumber}/${key}/public-download-policy-url`,
  });
};
