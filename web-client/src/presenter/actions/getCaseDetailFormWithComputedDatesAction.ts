import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * combines the dates in the form with the caseDetails
 *
 * @param {object} providers the cerebral providers
 * @param {Function} providers.get the cerebral get function for getting the state.form
 * @returns {object} the formWithComputedDates
 */
export const getCaseDetailFormWithComputedDatesAction = ({
  applicationContext,
  get,
}) => {
  const {
    irsDay,
    irsMonth,
    irsYear,
    paymentDateDay,
    paymentDateMonth,
    paymentDateWaivedDay,
    paymentDateWaivedMonth,
    paymentDateWaivedYear,
    paymentDateYear,
    receivedAtDay,
    receivedAtMonth,
    receivedAtYear,
  } = {
    ...get(state.form),
  };

  const form = omit(
    {
      ...get(state.form),
    },
    [
      'irsYear',
      'irsMonth',
      'irsDay',
      'paymentDateYear',
      'paymentDateMonth',
      'paymentDateDay',
      'paymentDateWaivedYear',
      'paymentDateWaivedMonth',
      'paymentDateWaivedDay',
      'receivedAtYear',
      'receivedAtMonth',
      'receivedAtDay',
      'trialCities',
    ],
  );

  form.irsNoticeDate = applicationContext
    .getUtilities()
    .checkDate(`${irsYear}-${irsMonth}-${irsDay}`);

  form.petitionPaymentDate = applicationContext
    .getUtilities()
    .checkDate(`${paymentDateYear}-${paymentDateMonth}-${paymentDateDay}`);

  form.petitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .checkDate(
      `${paymentDateWaivedYear}-${paymentDateWaivedMonth}-${paymentDateWaivedDay}`,
    );
  form.receivedAt = applicationContext
    .getUtilities()
    .checkDate(`${receivedAtYear}-${receivedAtMonth}-${receivedAtDay}`);

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
