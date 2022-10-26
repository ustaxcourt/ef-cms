export const openUrlInNewTab = async (fileName, getUrlCb) => {
  let openFileViewerWindow;
  let url;

  try {
    ({ url } = await getUrlCb());
  } catch (err) {
    throw new Error(`Unable to get document download url. ${e.message}`);
  }

  if (/\.docx?/.test(fileName)) {
    window.location.href = url;
  } else {
    openFileViewerWindow = window.open();
    openFileViewerWindow.document.write('Loading your document...');
    openFileViewerWindow.location.href = url;
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
