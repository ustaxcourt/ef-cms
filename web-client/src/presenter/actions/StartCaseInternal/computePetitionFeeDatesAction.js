import { state } from 'cerebral';

/**
 * computes the petitionPaymentDate and petitionPaymentWaivedDate from the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} props object
 */
export const computePetitionFeeDatesAction = ({ applicationContext, get }) => {
  const form = get(state.form);

  const petitionPaymentDate = applicationContext
    .getUtilities()
    .validateDateAndCreateISO({
      day: form.paymentDateDay,
      month: form.paymentDateMonth,
      year: form.paymentDateYear,
    });

  const petitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .validateDateAndCreateISO({
      day: form.paymentDateWaivedDay,
      month: form.paymentDateWaivedMonth,
      year: form.paymentDateWaivedYear,
    });

  return { petitionPaymentDate, petitionPaymentWaivedDate };
};
