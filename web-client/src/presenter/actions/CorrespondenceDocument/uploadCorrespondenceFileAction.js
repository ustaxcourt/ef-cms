import { state } from 'cerebral';

/**
 * upload correspondence document to s3.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadCorrespondenceFileAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { primaryDocumentFile } = get(state.form);

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadCorrespondenceDocumentInteractor(applicationContext, {
        documentFile: primaryDocumentFile,
      });

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
