import { state } from 'cerebral';

/**
 * Sets the total penalties amount from props on the statistic from the given index from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store there cerebral store object
 * @returns {void} sets the form value for the given props.statisticIndex
 */
export const setTotalPenaltiesAmountForAddStatisticAction = ({
  get,
  props,
  store,
}) => {
  const { totalPenalties } = props;
  const { key } = get(state.modal);
  store.set(state.form[key], totalPenalties);
};
