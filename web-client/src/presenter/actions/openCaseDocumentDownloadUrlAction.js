import { openUrlInNewTab } from './openPractitionerDocumentDownloadUrlAction';
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
  const {
    docketEntryId,
    docketNumber,
    isForIFrame = false,
    isPublic,
    useSameTab,
  } = props;

  if (!isForIFrame && !useSameTab) {
    await openUrlInNewTab(`${docketEntryId}.pdf`, () =>
      applicationContext
        .getUseCases()
        .getDocumentDownloadUrlInteractor(applicationContext, {
          docketNumber,
          isPublic,
          key: docketEntryId,
        }),
    );
  } else {
    const { url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic,
        key: docketEntryId,
      });

    if (isForIFrame) {
      store.set(state.iframeSrc, url);
    } else if (useSameTab) {
      window.location.href = url;
    }
  }
};
