import { state } from 'cerebral';

/**
 * submits the edit privatePractitioners modal, removing and/or updating the privatePractitioners on the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.modal and state.caseDetail.docketNumber
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const submitEditPrivatePractitionersModalAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const form = get(state.modal);
  const docketNumber = get(state.caseDetail.docketNumber);

  const { privatePractitioners } = form;

  for (const practitioner of privatePractitioners) {
    if (practitioner.removeFromCase) {
      await applicationContext.getUseCases().deleteCounselFromCaseInteractor({
        applicationContext,
        docketNumber,
        userId: practitioner.userId,
      });
    } else {
      await applicationContext.getUseCases().updateCounselOnCaseInteractor({
        applicationContext,
        docketNumber,
        userData: practitioner,
        userId: practitioner.userId,
      });
    }
  }

  return path.success({
    alertSuccess: {
      message: 'Petitioner counsel updated.',
    },
  });
};
