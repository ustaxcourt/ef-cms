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
  const form = omit(
    {
      ...get(state.form),
    },
    ['trialCities'],
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
