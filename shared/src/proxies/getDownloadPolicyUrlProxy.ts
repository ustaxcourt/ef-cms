import { get } from './requests';

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.key the key of the document to get
 * @returns {Promise<*>} the promise of the api call
 */
export const getDownloadPolicyUrl = ({
  applicationContext,
  docketNumber,
  key,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${key}/download-policy-url`,
  });
};
