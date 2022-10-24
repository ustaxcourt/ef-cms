export const openUrlInNewTab = async (fileName, getUrlCb) => {
  let openedPdfWindow;
  openedPdfWindow = window.open();
  openedPdfWindow.document.write('Loading your document...');

  try {
    const { url } = await getUrlCb();
    openedPdfWindow.location.href = url;
    if (/\.docx?/.test(fileName)) {
      setTimeout(() => {
        openedPdfWindow?.close();
      }, 1);
    }
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
  const { barNumber, fileName, practitionerDocumentFileId } = props;

  await openUrlInNewTab(fileName, () =>
    applicationContext
      .getUseCases()
      .getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
        barNumber,
        practitionerDocumentFileId,
      }),
  );
};
