import { state } from '@web-client/presenter/app.cerebral';

/**
 * upload document to s3.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadOrderFileAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { primaryDocumentFile } = get(state.form);

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor(applicationContext, {
        documentFile: primaryDocumentFile,
      });

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
