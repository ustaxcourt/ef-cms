import { get } from '../requests';

/**
 * getStatusOfVirusScanInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to get the status of
 * @returns {Promise<*>} the promise of the api call
 */
export const getStatusOfVirusScanInteractor = (applicationContext, { key }) => {
  return get({
    applicationContext,
    endpoint: `/documents/${key}/virus-scan`,
  });
};
