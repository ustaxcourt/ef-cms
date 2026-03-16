import { asyncSyncHandler, post } from './requests';

/**
 * generateDocketRecordPdfInteractor (proxy)
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.docketRecordSort the sort for the docket record
 * @param {object} providers.docketRecordTableSort the table sort for the docket record
 * @param {boolean} providers.includePartyDetail whether to include party detail
 * @param {boolean} providers.isIndirectlyAssociated whether the user is indirectly associated
 * @returns {Promise<*>} the promise of the api call
 */
export const generateDocketRecordPdfInteractor = (
  applicationContext,
  {
    docketNumber,
    docketRecordSort,
    docketRecordTableSort,
    includePartyDetail,
    isIndirectlyAssociated,
  },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: {
          docketNumber,
          docketRecordSort,
          docketRecordTableSort,
          includePartyDetail,
          isIndirectlyAssociated,
        },
        endpoint: '/async/docket-record-pdf',
      }),
  ) as Promise<{
    fileId: string;
    url: string;
  }>;
};
