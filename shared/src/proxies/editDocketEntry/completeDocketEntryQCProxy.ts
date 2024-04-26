import { asyncSyncHandler, put } from '../requests';

/**
 * completeDocketEntryQCInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {Promise<*>} the promise of the api call
 */
export const completeDocketEntryQCInteractor = (
  applicationContext,
  { entryMetadata },
) => {
  const { docketNumber } = entryMetadata;
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await put({
        applicationContext,
        asyncSyncId,
        body: {
          entryMetadata,
        },
        endpoint: `/async/case-documents/${docketNumber}/docket-entry-complete`,
      }),
  );
};
