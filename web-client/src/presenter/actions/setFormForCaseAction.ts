import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the form's dates (split into month/day/year) based on the caseDetail provided in state.caseDetail
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const setFormForCaseAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const caseDetail = props.caseDetail || get(state.caseDetail);

  if (caseDetail.statistics) {
    caseDetail.statistics.forEach((statistic, index) => {
      if (statistic.lastDateOfPeriod) {
        const deconstructedLastDateOfPeriod = applicationContext
          .getUtilities()
          .deconstructDate(statistic.lastDateOfPeriod);

        if (deconstructedLastDateOfPeriod) {
          store.set(
            state.form.statistics[index].lastDateOfPeriodMonth,
            deconstructedLastDateOfPeriod.month,
          );
          store.set(
            state.form.statistics[index].lastDateOfPeriodDay,
            deconstructedLastDateOfPeriod.day,
          );
          store.set(
            state.form.statistics[index].lastDateOfPeriodYear,
            deconstructedLastDateOfPeriod.year,
          );
        }
      }
    });
  }
};
