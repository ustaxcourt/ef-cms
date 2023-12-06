import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * upload document to s3.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {object} providers.store the cerebral store object
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadDocketEntryFileAction = async ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const { primaryDocumentFile } = get(state.form);
  const docketEntryId = get(state.docketEntryId);

  const progressFunctions = setupPercentDone(
    {
      primary: primaryDocumentFile,
    },
    store,
  );

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadDocumentInteractor(applicationContext, {
        documentFile: primaryDocumentFile,
        key: docketEntryId,
        onUploadProgress: progressFunctions.primary,
      });

    return path.success({
      docketEntryId: primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
