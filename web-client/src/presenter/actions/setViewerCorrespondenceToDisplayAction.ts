import { state } from 'cerebral';

/**
 * sets the viewerCorrespondenceToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setViewerCorrespondenceToDisplayAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { viewerCorrespondenceToDisplay } = props;
  const docketNumber = get(state.caseDetail.docketNumber);

  store.set(state.viewerCorrespondenceToDisplay, viewerCorrespondenceToDisplay);

  if (viewerCorrespondenceToDisplay) {
    const { url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic: false,
        key: viewerCorrespondenceToDisplay.correspondenceId,
      });

    store.set(state.iframeSrc, url);
  }
};
