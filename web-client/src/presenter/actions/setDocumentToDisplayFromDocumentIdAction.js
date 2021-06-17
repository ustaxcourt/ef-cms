import { state } from 'cerebral';

/**
 * sets the iframeSrc to the document download url for the document in state.docketEntryId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDocumentToDisplayFromDocumentIdAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntryId = get(state.docketEntryId);

  const { url } = await applicationContext
    .getUseCases()
    .getDocumentDownloadUrlInteractor(applicationContext, {
      docketNumber,
      isPublic: false,
      key: docketEntryId,
    });

  store.set(state.iframeSrc, url);
};
