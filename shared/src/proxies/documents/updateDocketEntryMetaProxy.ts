import { asyncSyncHandler, put } from '../requests';

/**
 * updateDocketEntryMetaProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number of the case to be updated
 * @param {object} providers.docketRecordIndex the index of the docket record entry to be updated
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @returns {Promise<*>} the promise of the api call
 */
export const updateDocketEntryMetaInteractor = (
  applicationContext,
  { docketEntryMeta, docketNumber, docketRecordIndex },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await put({
        applicationContext,
        asyncSyncId,
        body: {
          docketEntryMeta,
          docketRecordIndex,
        },
        endpoint: `/async/case-documents/${docketNumber}/docket-entry-meta`,
      }),
  );
};
