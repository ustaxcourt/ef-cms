import { state } from '@web-client/presenter/app.cerebral';

/**
 * opens the document in a new tab
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess
 */
export const openCaseDocumentDownloadUrlAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const {
    docketEntryId,
    docketNumber,
    isForIFrame = false,
    isPublic,
    useSameTab,
  } = props;

  let url;
  try {
    ({ url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic,
        key: docketEntryId,
      }));
  } catch (err) {
    throw new Error(`Unable to open document. ${err.message}`);
  }

  if (!isForIFrame && !useSameTab) {
    await applicationContext.getUtilities().openUrlInNewTab({ url });
  } else {
    if (isForIFrame) {
      store.set(state.iframeSrc, url);
    } else if (useSameTab) {
      window.location.href = url;
    }
  }
};
