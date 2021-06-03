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
  const docketNumber = get(state.caseDetail.docketNumber);

  store.set(state.viewerDraftDocumentToDisplay, viewerDraftDocumentToDisplay);

  if (viewerDraftDocumentToDisplay) {
    store.set(
      state.screenMetadata.draftDocumentViewerDocketEntryId,
      viewerDraftDocumentToDisplay.docketEntryId,
    );

    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        docketNumber,
        isPublic: false,
        key: viewerDraftDocumentToDisplay.docketEntryId,
      });

    store.set(state.iframeSrc, url);
  }
};
