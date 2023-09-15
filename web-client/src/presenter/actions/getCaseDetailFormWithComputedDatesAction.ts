import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * combines the dates in the form with the caseDetails
 * @param {object} providers the cerebral providers
 * @param {Function} providers.get the cerebral get function for getting the state.form
 * @returns {object} the formWithComputedDates
 */
export const getCaseDetailFormWithComputedDatesAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const {
    paymentDateDay,
    paymentDateMonth,
    paymentDateWaivedDay,
    paymentDateWaivedMonth,
    paymentDateWaivedYear,
    paymentDateYear,
  } = {
    ...get(state.form),
  };

  const form = omit(
    {
      ...get(state.form),
    },
    [
      'paymentDateYear',
      'paymentDateMonth',
      'paymentDateDay',
      'paymentDateWaivedYear',
      'paymentDateWaivedMonth',
      'paymentDateWaivedDay',
      'trialCities',
    ],
  );

  form.petitionPaymentDate = applicationContext
    .getUtilities()
    .checkDate(`${paymentDateYear}-${paymentDateMonth}-${paymentDateDay}`);

  form.petitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .checkDate(
      `${paymentDateWaivedYear}-${paymentDateWaivedMonth}-${paymentDateWaivedDay}`,
    );

  if (form.statistics) {
    form.statistics.forEach(statistic => {
      statistic.lastDateOfPeriod = applicationContext
        .getUtilities()
        .checkDate(
          `${statistic.lastDateOfPeriodYear}-${statistic.lastDateOfPeriodMonth}-${statistic.lastDateOfPeriodDay}`,
        );
    });
  }

  return {
    formWithComputedDates: form,
  };
};
