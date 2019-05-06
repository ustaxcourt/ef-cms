import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 */
export const uploadExternalDocumentsAction = async ({
  get,
  applicationContext,
}) => {
  const { primaryDocumentFile, secondaryDocumentFile } = get(state.form);

  const documentFiles = [primaryDocumentFile, secondaryDocumentFile];

  const documentIds = await applicationContext
    .getUseCases()
    .uploadExternalDocuments({
      applicationContext,
      documentFiles,
    });

  const [primaryDocumentFileId, secondaryDocumentFileId] = documentIds;

  return { primaryDocumentFileId, secondaryDocumentFileId };
};
