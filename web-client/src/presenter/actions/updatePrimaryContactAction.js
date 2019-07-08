import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {void}
 */
export const updatePrimaryContactAction = async ({
  applicationContext,
  get,
}) => {
  const caseToUpdate = get(state.caseDetail);
  const contactInfo = get(state.contactToEdit.contactPrimary);
  const updatedCase = await applicationContext
    .getUseCases()
    .updatePrimaryContactInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      contactInfo,
    });

  return { caseDetail: updatedCase };
};
