import { asyncSyncHandler, post } from '../requests';

/**
 * validatePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @returns {Promise<*>} the promise of the api call
 */
export const validatePdfInteractor = (applicationContext, { key }) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        endpoint: `/async/documents/${key}/validate`,
      }),
  );
};
