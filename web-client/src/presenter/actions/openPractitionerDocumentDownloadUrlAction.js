export const openUrlInNewTab = async getUrlCb => {
  let url;

  try {
    const openFileViewerWindow = window.open();
    openFileViewerWindow.document.write('Loading your document...');

    ({ url } = await getUrlCb());
    openFileViewerWindow.location.href = url;
  } catch (err) {
    throw new Error(`Unable to get document download url. ${err.message}`);
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
