import { state } from 'cerebral';

/**
 * sets the statistic index from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setStatisticIndexAction = ({ props, store }) => {
  store.set(state.modal.statisticIndex, props.statisticIndex);
  store.set(state.modal.key, props.key);
};
