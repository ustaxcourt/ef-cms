import { state } from 'cerebral';

/**
 * updates petition fee payment information on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab
 */
export const updatePetitionFeePaymentAction = async ({
  applicationContext,
  get,
}) => {
  const caseToUpdate = get(state.caseDetail);
  const {
    petitionPaymentDate,
    petitionPaymentMethod,
    petitionPaymentStatus,
    petitionPaymentWaivedDate,
  } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updatePetitionFeePaymentInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      petitionPaymentDate,
      petitionPaymentMethod,
      petitionPaymentStatus,
      petitionPaymentWaivedDate,
    });

  // TODO
  return {
    alertSuccess: {
      message: 'Please confirm the information below is correct.',
      title: 'Your changes have been saved.',
    },
    caseDetail: updatedCase,
    caseId: updatedCase.docketNumber,
    tab: 'caseInfo',
  };
};
