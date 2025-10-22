import { state } from '@web-client/presenter/app.cerebral';

export const setViewerDocumentToDisplayAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { viewerDocumentToDisplay } = props;
  const { docketNumber } = get(state.caseDetail);

  store.set(state.viewerDocumentToDisplay, viewerDocumentToDisplay);

  if (viewerDocumentToDisplay) {
    store.set(state.docketEntryId, viewerDocumentToDisplay.docketEntryId);

    const { url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic: false,
        key: viewerDocumentToDisplay.docketEntryId,
      });

    store.set(state.iframeSrc, url);
  }
};
