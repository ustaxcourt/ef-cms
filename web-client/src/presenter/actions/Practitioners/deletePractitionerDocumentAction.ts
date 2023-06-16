import { state } from '@web-client/presenter/app.cerebral';

/**
 * delete a practitioner document
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const deletePractitionerDocumentAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const practitionerDocumentFileId = get(
    state.modal.practitionerDocumentFileId,
  );
  const barNumber = get(state.modal.barNumber);

  try {
    await applicationContext
      .getUseCases()
      .deletePractitionerDocumentInteractor(applicationContext, {
        barNumber,
        practitionerDocumentFileId,
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
