import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadDocketEntryFileAction = async ({
  applicationContext,
  get,
  path,
  props,
  store,
}) => {
  const { primaryDocumentFile } = get(state.form);
  const documentId = props.documentId || get(state.documentId);

  const progressFunctions = setupPercentDone(
    {
      primary: primaryDocumentFile,
    },
    store,
  );

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadDocumentInteractor({
        applicationContext,
        documentFile: primaryDocumentFile,
        documentId,
        onUploadProgress: progressFunctions.primary,
      });

    return path.success({
      documentId: primaryDocumentFileId,
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
