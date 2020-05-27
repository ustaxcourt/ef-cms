import { state } from 'cerebral';

/**
 * sets the state.form yearOrPeriod
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 */
export const setDefaultFormForAddDeficiencySatisticsAction = ({
  props,
  store,
}) => {
  store.set(state.form, {
    yearOrPeriod: props.yearOrPeriod || 'Year',
  });
};
