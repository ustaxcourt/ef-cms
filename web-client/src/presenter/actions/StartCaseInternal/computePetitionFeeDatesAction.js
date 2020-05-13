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

  let petitionPaymentDate;
  if (
    applicationContext
      .getUtilities()
      .isValidDateString(
        `${form.paymentDateMonth}-${form.paymentDateDay}-${form.paymentDateYear}`,
      )
  ) {
    petitionPaymentDate = applicationContext
      .getUtilities()
      .createISODateStringFromObject({
        day: form.paymentDateDay,
        month: form.paymentDateMonth,
        year: form.paymentDateYear,
      });
  }

  let petitionPaymentWaivedDate;
  if (
    applicationContext
      .getUtilities()
      .isValidDateString(
        `${form.paymentDateWaivedMonth}-${form.paymentDateWaivedDay}-${form.paymentDateWaivedYear}`,
      )
  ) {
    petitionPaymentWaivedDate = applicationContext
      .getUtilities()
      .createISODateStringFromObject({
        day: form.paymentDateWaivedDay,
        month: form.paymentDateWaivedMonth,
        year: form.paymentDateWaivedYear,
      });
  }

  return { petitionPaymentDate, petitionPaymentWaivedDate };
};
