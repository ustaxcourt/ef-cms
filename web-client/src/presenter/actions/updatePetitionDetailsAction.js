import { state } from 'cerebral';

/**
 * updates petition fee payment information on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, docketNumber, tab, caseDetail
 */
export const updatePetitionDetailsAction = async ({
  applicationContext,
  get,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
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
      docketNumber,
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
    docketNumber,
    tab: 'caseInfo',
  };
};
