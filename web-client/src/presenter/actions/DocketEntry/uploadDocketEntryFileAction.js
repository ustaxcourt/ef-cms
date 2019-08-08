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
  store,
}) => {

  const { primaryDocumentFile } = get(state.form);

  const progressFunctions = setupPercentDone(
    {
      primary: primaryDocumentFile,
    },
    store,
  );

  try {
    const [
      primaryDocumentFileId,
    ] = await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor({
        applicationContext,
        documentFiles: [
          primaryDocumentFile,
        ],
        onUploadProgresses: [
          progressFunctions.primary,
        ],
      });

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
