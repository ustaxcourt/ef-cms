import { state } from 'cerebral';

/**
 * delete correspondence document from a case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if deleting the correspondence document was successful or not
 */
export const deleteCorrespondenceDocumentAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const documentId = get(state.modal.correspondenceToDelete.documentId);

  try {
    await applicationContext
      .getUseCases()
      .deleteCorrespondenceDocumentInteractor({
        applicationContext,
        docketNumber,
        documentId,
      });

    return path.success();
  } catch (err) {
    return path.error();
  }
};
