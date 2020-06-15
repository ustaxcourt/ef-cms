import { state } from 'cerebral';

/**
 * opens the document in a new tab
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess
 */
export const openCaseDocumentDownloadUrlAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { caseId, documentId, isForIFrame, isPublic } = props;

  const {
    url,
  } = await applicationContext.getUseCases().getDocumentDownloadUrlInteractor({
    applicationContext,
    caseId,
    documentId,
    isPublic,
  });

  if (isForIFrame) {
    store.set(state.iframeSrc, url);
  } else {
    window.open(url, '_blank');
  }
};
