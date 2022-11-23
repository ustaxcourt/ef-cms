export const openUrlInNewTab = async getUrlCb => {
  let url;

  const openFileViewerWindow = window.open();

  try {
    ({ url } = await getUrlCb());
  } catch (err) {
    throw new Error(`Unable to get document download url. ${err.message}`);
  }

  openFileViewerWindow.document.write('Loading your document...');
  openFileViewerWindow.location.href = url;
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
  const { barNumber, practitionerDocumentFileId } = props;

  await openUrlInNewTab(() =>
    applicationContext
      .getUseCases()
      .getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
        barNumber,
        practitionerDocumentFileId,
      }),
  );
};
