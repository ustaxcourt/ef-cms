import { state } from 'cerebral';

/**
 * updates petition fee payment information on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab, caseDetail
 */
export const updatePetitionDetailsAction = async ({
  applicationContext,
  get,
}) => {
  const caseToUpdate = get(state.caseDetail);
  const form = get(state.form);

  const petitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .createISODateStringFromObject({
      day: form.paymentDateWaivedDay,
      month: form.paymentDateWaivedMonth,
      year: form.paymentDateWaivedYear,
    });

  const petitionPaymentDate = applicationContext
    .getUtilities()
    .createISODateStringFromObject({
      day: form.paymentDateDay,
      month: form.paymentDateMonth,
      year: form.paymentDateYear,
    });

  const irsNoticeDate = applicationContext
    .getUtilities()
    .createISODateStringFromObject({
      day: form.irsDay,
      month: form.irsMonth,
      year: form.irsYear,
    });

  const updatedCase = await applicationContext
    .getUseCases()
    .updatePetitionDetailsInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      petitionDetails: {
        ...form,
        irsNoticeDate,
        petitionPaymentDate,
        petitionPaymentWaivedDate,
        preferredTrialCity: form.preferredTrialCity
          ? form.preferredTrialCity
          : null,
      },
    });

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    caseDetail: updatedCase,
    caseId: updatedCase.docketNumber,
    tab: 'caseInfo',
  };
};
