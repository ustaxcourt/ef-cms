import { state } from 'cerebral';

/**
 * sets the iframeSrc to the document download url for the document in state.documentId
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
  const documentId = get(state.documentId);

  const {
    url,
  } = await applicationContext.getUseCases().getDocumentDownloadUrlInteractor({
    applicationContext,
    docketNumber,
    documentId,
    isPublic: false,
  });

  store.set(state.iframeSrc, url);
};
