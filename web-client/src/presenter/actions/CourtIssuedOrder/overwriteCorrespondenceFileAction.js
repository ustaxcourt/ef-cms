import { state } from 'cerebral';

/**
 * upload correspondence to s3.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path to take depending on if the correspondence file was uploaded successfully or not
 * @param {object} providers.get the cerebral get method used for getting state
 * @returns {object} the next path based on if the correspondence file was successfully uploaded or not
 */
export const overwriteCorrespondenceFileAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { primaryDocumentFile } = get(state.form);
  const docketEntryId = get(state.docketEntryId);

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor(applicationContext, {
        documentFile: primaryDocumentFile,
        keyToOverwrite: docketEntryId,
      });

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
