import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadExternalDocumentsAction = async ({
  get,
  store,
  path,
  applicationContext,
}) => {
  const {
    primaryDocumentFile,
    secondaryDocumentFile,
    supportingDocumentFile,
  } = get(state.form);

  const progressFunctions = setupPercentDone(
    {
      primary: primaryDocumentFile,
      secondary: secondaryDocumentFile,
      supporting: supportingDocumentFile,
    },
    store,
  );

  try {
    const [
      primaryDocumentFileId,
      secondaryDocumentFileId,
      supportingDocumentFileId,
    ] = await applicationContext.getUseCases().uploadExternalDocuments({
      applicationContext,
      documentFiles: [
        primaryDocumentFile,
        secondaryDocumentFile,
        supportingDocumentFile,
      ],
      onUploadProgresses: [
        progressFunctions.primary,
        progressFunctions.secondary,
        progressFunctions.supporting,
      ],
    });

    return path.success({
      primaryDocumentFileId,
      secondaryDocumentFileId,
      supportingDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
