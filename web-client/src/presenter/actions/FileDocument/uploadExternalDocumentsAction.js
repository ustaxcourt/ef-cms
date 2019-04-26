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
  const { primaryDocumentFile } = get(state.form);

  const documentFiles = [primaryDocumentFile];

  const documentIds = await applicationContext
    .getUseCases()
    .uploadExternalDocuments({
      applicationContext,
      documentFiles,
    });

  const [primaryDocumentFileId] = documentIds;

  return { primaryDocumentFileId };
};
