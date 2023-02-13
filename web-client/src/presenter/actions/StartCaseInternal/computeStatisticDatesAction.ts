import { state } from 'cerebral';

export const combineLastDateOfPeriodFields = ({ applicationContext, form }) => {
  const newForm = {
    ...form,
  };

  const computedLastDateOfPeriod = applicationContext
    .getUtilities()
    .validateDateAndCreateISO({
      day: newForm.lastDateOfPeriodDay,
      month: newForm.lastDateOfPeriodMonth,
      year: newForm.lastDateOfPeriodYear,
    });

  newForm.lastDateOfPeriod = computedLastDateOfPeriod;

  return newForm;
};

/**
 * computes the dates for the statistics array from the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const computeStatisticDatesAction = ({
  applicationContext,
  get,
  store,
}) => {
  let statistics = get(state.form.statistics) || [];

  statistics = statistics.map(statistic =>
    combineLastDateOfPeriodFields({
      applicationContext,
      form: statistic,
    }),
  );

  store.set(state.form.statistics, statistics);
};
