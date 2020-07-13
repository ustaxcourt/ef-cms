import { state } from 'cerebral';

/**
 * clears the statistics form values if the yearOrPeriod value changes
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearStatisticsFormValuesAction = ({ props, store }) => {
  if (props.key.includes('yearOrPeriod')) {
    const index = props.key.split('.')[1];
    store.unset(state.form.statistics[index].lastDateOfPeriodDay);
    store.unset(state.form.statistics[index].lastDateOfPeriodMonth);
    store.unset(state.form.statistics[index].lastDateOfPeriodYear);
    store.unset(state.form.statistics[index].year);
    store.unset(state.form.statistics[index].irsDeficiencyAmount);
    store.unset(state.form.statistics[index].irsTotalPenalties);
  }
};
