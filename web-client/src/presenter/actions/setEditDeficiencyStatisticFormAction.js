import { state } from 'cerebral';

/**
 * sets the state.form using the statistic from the caseDetail
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setEditDeficiencyStatisticFormAction = ({ get, props, store }) => {
  const { statistics } = get(state.caseDetail);
  const { statisticIndex } = props;

  store.set(state.form, {
    ...statistics[statisticIndex],
  });
};
