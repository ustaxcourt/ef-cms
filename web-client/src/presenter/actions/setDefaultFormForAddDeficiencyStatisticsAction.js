import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the state.form yearOrPeriod
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 */
export const setDefaultFormForAddDeficiencyStatisticsAction = ({
  get,
  store,
}) => {
  let statistics = get(state.caseDetail.statistics);
  if (isEmpty(statistics)) {
    statistics = [{}];
  }

  store.set(state.form, {
    penalties: [],
    yearOrPeriod: 'Year',
  });
};
