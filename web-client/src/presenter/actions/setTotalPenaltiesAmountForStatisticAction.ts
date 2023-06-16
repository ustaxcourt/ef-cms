import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the total penalties amount from props on the statistic from the given index from props
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store there cerebral store object
 * @returns {void} sets the form value for the given props.statisticIndex
 */
export const setTotalPenaltiesAmountForStatisticAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { allPenalties, sumOfPenalties } = props;
  const { key, statisticIndex } = get(state.modal);

  if (typeof statisticIndex === 'number') {
    store.set(state.form.statistics[statisticIndex][key], sumOfPenalties);
    store.set(state.form.statistics[statisticIndex].penalties, allPenalties);
  } else {
    store.set(state.form[key], sumOfPenalties);
    store.set(state.form.penalties, allPenalties);
  }
};
