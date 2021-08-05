import { state } from 'cerebral';

/**
 * submits the edit petitioner counsel, updating the given private practitioner on the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.form and state.caseDetail.docketNumber
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const submitEditPetitionerCounselAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const form = get(state.form);
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;

  await applicationContext
    .getUseCases()
    .updateCounselOnCaseInteractor(applicationContext, {
      docketNumber,
      userData: form,
      userId: form.userId,
    });

  return path.success({
    alertSuccess: {
      message: 'Petitioner counsel updated.',
    },
  });
};
