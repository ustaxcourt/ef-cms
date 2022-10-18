import { state } from 'cerebral';

/**
 * delete a case note from a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const deletePractitionerDocumentAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const documentId = get(state.modal.documentId);
  const barNumber = get(state.modal.barNumber);

  //TODO: success message?

  try {
    await applicationContext
      .getUseCases()
      .deletePractitionerDocumentInteractor(applicationContext, {
        barNumber,
        documentId,
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Document could not be deleted.',
      },
    });
  }

  return path.success();
};
