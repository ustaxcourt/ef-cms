import { state } from 'cerebral';

/**
 * Sets the total penalties amount from props on the statistic from the given index from props
 *
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
}) => {
  const { totalPenalties } = props;
  const { statisticIndex } = get(state.modal);

  store.set(
    state.form.statistics[statisticIndex].irsTotalPenalties,
    totalPenalties,
  );
};
