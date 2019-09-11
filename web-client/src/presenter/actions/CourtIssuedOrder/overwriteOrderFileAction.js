import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the next path based on if validation was successful or error
 */
export const overwriteOrderFileAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { primaryDocumentFile } = get(state.form);
  const documentToEdit = get(state.documentToEdit);

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor({
        applicationContext,
        documentFile: primaryDocumentFile,
        documentIdToOverwrite: documentToEdit.documentId,
      });

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
