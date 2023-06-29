import { state } from '@web-client/presenter/app.cerebral';

/**
 * upload document to s3.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path to take depending on if the file was uploaded successfully or not
 * @param {object} providers.get the cerebral get method used for getting state
 * @returns {object} the next path based on if the file was successfully uploaded or not
 */
export const overwriteOrderFileAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { primaryDocumentFile } = get(state.form);
  const documentToEdit = get(state.documentToEdit);

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor(applicationContext, {
        documentFile: primaryDocumentFile,
        fileIdToOverwrite: documentToEdit.docketEntryId,
      });

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
