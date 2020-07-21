import { state } from 'cerebral';

/**
 * sets the viewerDraftDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setViewerDraftDocumentToDisplayAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { viewerDraftDocumentToDisplay } = props;
  const { caseId } = get(state.caseDetail);

  store.set(state.viewerDraftDocumentToDisplay, viewerDraftDocumentToDisplay);
  if (viewerDraftDocumentToDisplay) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        caseId,
        documentId: viewerDraftDocumentToDisplay.documentId,
        isPublic: false,
      });

    store.set(state.iframeSrc, url);
  }
};
