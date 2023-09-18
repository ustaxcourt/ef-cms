import { state } from '@web-client/presenter/app.cerebral';

/**
 * computes the petitionPaymentDate, petitionPaymentWaivedDate, and irsNoticeDate from the form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} props object
 */
export const computePetitionDatesAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const form = get(state.form);

  const petitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .validateDateAndCreateISO({
      day: form.paymentDateWaivedDay,
      month: form.paymentDateWaivedMonth,
      year: form.paymentDateWaivedYear,
    });

  return { petitionPaymentWaivedDate };
};
