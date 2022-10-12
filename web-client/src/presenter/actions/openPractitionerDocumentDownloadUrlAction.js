export const openUrlInNewTab = async getUrlCb => {
  let openedPdfWindow;
  openedPdfWindow = window.open();
  openedPdfWindow.document.write('Loading your document...');

  try {
    const { url } = await getUrlCb();
    openedPdfWindow.location.href = url;
  } catch (e) {
    openedPdfWindow?.close();
    throw new Error(`Unable to get document download url. ${e.message}`);
  }
};

/**
 * opens the practitioner document in a new tab
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess
 */
export const openPractitionerDocumentDownloadUrlAction = async ({
  applicationContext,
  props,
}) => {
  const { documentId } = props;

  await openUrlInNewTab(() =>
    applicationContext
      .getUseCases()
      .getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
        documentId,
      }),
  );
};
