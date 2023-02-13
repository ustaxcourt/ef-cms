import { state } from 'cerebral';

/**
 * archive correspondence document from a case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if deleting the correspondence document was successful or not
 */
export const archiveCorrespondenceDocumentAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const correspondenceId = get(
    state.modal.correspondenceToDelete.correspondenceId,
  );

  try {
    await applicationContext
      .getUseCases()
      .archiveCorrespondenceDocumentInteractor(applicationContext, {
        correspondenceId,
        docketNumber,
      });

    return path.success();
  } catch (err) {
    return path.error();
  }
};
