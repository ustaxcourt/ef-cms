import { state } from 'cerebral';

/**
 * sets the state.form to the pros.value passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearStatisticsFormValuesAction = ({ props, store }) => {
  if (props.key.includes('yearOrPeriod')) {
    store.unset(state.form.lastDateOfPeriodDay);
    store.unset(state.form.lastDateOfPeriodMonth);
    store.unset(state.form.lastDateOfPeriodYear);
    store.unset(state.form.year);
    store.unset(state.form.deficiencyAmount);
    store.unset(state.form.totalPenalties);
  }
};
