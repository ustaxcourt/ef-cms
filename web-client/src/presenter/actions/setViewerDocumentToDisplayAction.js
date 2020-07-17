import { state } from 'cerebral';

/**
 * sets the viewerDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setViewerDocumentToDisplayAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { viewerDocumentToDisplay } = props;
  const { caseId } = get(state.caseDetail);

  store.set(state.viewerDocumentToDisplay, viewerDocumentToDisplay);

  if (viewerDocumentToDisplay) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        caseId,
        documentId: viewerDocumentToDisplay.documentId,
        isPublic: false,
      });

    store.set(state.iframeSrc, url);
  }
};
