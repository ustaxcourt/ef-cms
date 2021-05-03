import { state } from 'cerebral';

/**
 * submits the edit petitioner counsel, updating the given private practitioner on the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.modal and state.caseDetail.docketNumber
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const submitEditPetitionerCounselAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const form = get(state.modal);
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;

  // TODO: send full petitioner counsel / private practitioner through the interactor
  // const petitionerCounsel = caseDetail.privatePractitioners.find(practitioner => practitioner.barNumber === )

  // await applicationContext.getUseCases().deleteCounselFromCaseInteractor({
  //   applicationContext,
  //   docketNumber,
  //   userId: practitioner.userId,
  // });
  await applicationContext.getUseCases().updateCounselOnCaseInteractor({
    applicationContext,
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
