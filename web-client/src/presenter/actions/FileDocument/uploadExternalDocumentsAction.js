import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 */
export const uploadExternalDocumentsAction = async ({
  get,
  store,
  path,
  applicationContext,
}) => {
  const { primaryDocumentFile, secondaryDocumentFile } = get(state.form);

  const progressFunctions = setupPercentDone(
    {
      primary: primaryDocumentFile,
      secondary: secondaryDocumentFile,
    },
    store,
  );

  try {
    const [
      primaryDocumentFileId,
      secondaryDocumentFileId,
    ] = await applicationContext.getUseCases().uploadExternalDocuments({
      applicationContext,
      documentFiles: [primaryDocumentFile, secondaryDocumentFile],
      onUploadProgresses: [
        progressFunctions.primary,
        progressFunctions.secondary,
      ],
    });

    return path.success({ primaryDocumentFileId, secondaryDocumentFileId });
  } catch (err) {
    return path.error();
  }
};
